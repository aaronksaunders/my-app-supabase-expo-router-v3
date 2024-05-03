import "react-native-url-polyfill/auto";
import { createClient, User } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

export const supabaseClient = createClient(
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
    console.log("login error", error);
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
export const uploadToSupabase = async ({
  uri,
  mimeType,
  fileName,
}: ImagePicker.ImagePickerAsset) => {
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

    const { data, error } = await supabaseClient.storage
      .from("images")
      .upload(encodeURIComponent(withoutSpaces), formData);
    if (error) throw error;

    console.log(data);

    return { data, error: undefined };
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
    const { data, error } = await supabaseClient.storage.from("images").list();
    if (error) throw error;
    return { data, error: undefined };
  } catch (e) {
    return { error: e, data: undefined };
  }
};
