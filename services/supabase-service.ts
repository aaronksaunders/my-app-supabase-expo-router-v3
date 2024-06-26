import "react-native-url-polyfill/auto";
import { createClient, User } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Database, Tables, Enums } from "~/types/supabase";

export const supabaseClient = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL as string,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

export interface SignInResponse {
  data: User | undefined;
  error: Error | undefined;
}

export interface SignOutResponse {
  error: any | undefined;
  data: {} | undefined;
}

export interface StorageObject {
  fullPath: string;
  id: string;
  path: string;
}
export interface ImageUploadResponse {
  data: StorageObject | undefined;
  error: Error | undefined;
}

/**
 *
 * @param email
 * @param password
 * @returns
 */
export const login = async (
  email: string,
  password: string
): Promise<SignInResponse> => {
  try {
    console.log(email, password);
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { data: data?.user, error: undefined };
  } catch (error) {
    return { error: error as Error, data: undefined };
  }
};

/**
 * Creates a new user account with the provided email, password, and username.
 *
 * @param email - The email address of the user.
 * @param password - The password for the user account.
 * @param username - The username for the user account.
 * @returns A Promise that resolves to a `SignInResponse` object containing the user data or an error.
 */
export const createAccount = async (
  email: string,
  password: string,
  username: string
): Promise<SignInResponse> => {
  try {
    console.log(email, password, username);
    let { error } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    const { data, error: updateErr } = await supabaseClient.auth.updateUser({
      data: { username },
    });
    if (updateErr) throw updateErr;

    return { data: data?.user as User, error: undefined };
  } catch (error) {
    console.log("login error", error);
    return { error: error as Error, data: undefined };
  }
};

/**
 *
 * @returns
 */
export const logout = async (): Promise<SignOutResponse> => {
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
    return { error: undefined, data: true };
  } catch (error) {
    return { error, data: undefined };
  } finally {
  }
};

/**
 * Uploads an image to Supabase storage.
 *
 * @param uri - The URI of the image to upload.
 * @param mimeType - The MIME type of the image.
 * @param fileName - The name of the image file.
 * @returns An object containing the uploaded data and any error that occurred during the upload.
 */
export const uploadToSupabase = async (
  isPublic = true,
  { uri, mimeType, fileName }: ImagePicker.ImagePickerAsset
) => {
  try {
    let formData = new FormData();
    let name;

    if (uri.startsWith("file://")) {
      name = uri.split("/").pop() as string;

      const photo = {
        uri: uri,
        type: mimeType,
        name: name,
      };

      formData.append("file", photo as any);
    } else {
      name = fileName!;

      // when on web
      const fetchResponse = await fetch(uri);
      const blob = await fetchResponse.blob();
      const fileFromBlob = new File([blob], name, {
        type: mimeType!,
      });

      formData.append("file", blob);
    }

    let withoutSpaces = name.replace(/\s/g, "_");

    // upload the image to the storage bucket
    const { data, error } = await supabaseClient.storage
      .from("images")
      .upload(encodeURIComponent(withoutSpaces), formData, {
        upsert: false,
      });
    if (error) throw error;
    const uploadData = data as {
      fullPath: string;
      id: string;
      path: string;
    };
    console.log("[image uploaded to storage] ==>", uploadData);

    // get current user
    const { data: getUserData, error: getUserError } =
      await supabaseClient.auth.getUser();
    if (getUserError) throw getUserError;

    // insert the image into the images table using the user's id
    // and  indicate if the image is public or not
    const { data: imageData, error: imageError } = await supabaseClient
      .from("images")
      .insert([
        {
          name: withoutSpaces,
          url: data?.path,
          is_public: isPublic,
          owner_id: getUserData?.user?.id,
          object_id: uploadData.id,
        } as Tables<"images">,
      ]);
    if (imageError) throw imageError;
    console.log("[image inserted into table] ==>", imageData);

    // return the image data on success
    return {
      data: imageData,
      error: undefined,
    };
  } catch (e) {
    return { error: e, data: undefined };
  }
};

/**
 * Fetches images from the Supabase storage.
 * @returns {Promise<any>} A promise that resolves to the fetched images data or an error object.
 */
export const imagesFetcher = async () => {
  try {
    // const { data, error } = await supabaseClient.storage.from("images").list();

    const { data, error } = await supabaseClient.from("images").select("*");
    if (error) throw error;

    return { data: data as Tables<"images">[], error: undefined };
  } catch (e) {
    console.log("imagesFetcher error", e);
    return { error: e, data: undefined };
  }
};

/**
 * Retrieves the public URL of an image from the Supabase storage.
 *
 * @param url {string} - The URL of the image.
 * @returns {signedUrl:string | null} The public URL of the image.
 */
export const getImage = async (url: string, width?:number, height?:number) => {
  const { data, error } = await supabaseClient.storage
    .from("images")
    .createSignedUrl(url, 120, {
      download: false,
      transform: {
        resize: 'contain',
        width: width,
        height: height,
        quality: 100,
      },
    });
  if (error) console.error("[getImage:createSignedUrl] ==> ", url, error);
  if (error) throw error;
  return data as { signedUrl: string } | null;
};
