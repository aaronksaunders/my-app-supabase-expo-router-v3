import { Alert, Button, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  getImage,
  imagesFetcher,
  uploadToSupabase,
} from "~/services/supabase-service";
import { ScrollView } from "react-native-gesture-handler";

export default function TabImagesScreen() {
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset>();
  const [images, setImages] = useState<[] | undefined>(undefined);

  const showAlert = (title: string, message: string) => {
    Alert.alert(title, message, [
      {
        text: "OK",
        onPress: () => console.log("OK Pressed"),
      },
    ]);
  };

  useEffect(() => {
    (async () => {
      const { data, error } = await imagesFetcher();
      data && console.log("[imagesFetcher] ==>", data);
      setImages(data as any);
      console.log(images);

      if (error) {
        showAlert("Error Fetching Images", (error as Error).message);
      }
    })();
  }, []);

  /**
   * Opens the image library and allows the user to pick an image.
   * If an image is selected, it sets the selected image as the component's state.
   * If no image is selected, it displays an alert.
   */
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result?.assets[0]);
    } else {
      showAlert("No Image Selected", "Please select an image to upload");
    }
  };

  /**
   * Handles the upload of an image to Supabase.
   *
   * @returns {Promise<void>} A promise that resolves when the upload is complete.
   */
  const handleUpload = async (): Promise<void> => {
    if (!image) {
      alert("No image selected");
      return;
    }

    // try to upload the image
    const uploadResp = await uploadToSupabase(
      true,
      image as ImagePicker.ImagePickerAsset
    );
    if (uploadResp.error) {
      console.error(uploadResp.error);
      showAlert("Error Uploading Image", (uploadResp.error as Error).message);
      return;
    } else {
      showAlert("Success", "Image uploaded successfully");
    }

    // if uploaded successfully, fetch images again
    const { data, error } = await imagesFetcher();
    if (!error) {
      setImages(data!);
      setImage(undefined);
    } else {
      console.error(error);
      showAlert("Error Fetching Images", (error as Error).message);
    }
  };

  return (
    <ScrollView>
      <View style={{ flex: 1, alignItems: "center", gap: 16, marginTop: 32 }}>
        <Text>{!image ? "No image selected" : image.fileName}</Text>
        {image && <Image source={image} style={{ width: 200, height: 200 }} />}
        <View style={{ flexDirection: "row", gap: 16 }}>
          <Button title="Pick" onPress={pickImageAsync} />
          <Button title="Clear" onPress={() => setImage(undefined)} />
          <Button title="Upload" onPress={handleUpload} />
        </View>
        <View style={{ display: "flex" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 24 }}>
            All Images
          </Text>
          <View style={{ width: 320, gap: 8 }}>
            {images?.map((image: any) => {
              return (
                <View key={image.id}>
                  <Text>ID: {image.id}</Text>
                  <Text>NAME: {image.name}</Text>
                  <Text>OWNER: {image.owner_id}</Text>
                  <RenderImage image={image} />
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const RenderImage = ({ image }: { image: any }) => {
  const [img, setImg] = useState<string>();

  useEffect(() => {
    (async () => {
      const img = await getImage(image.name);
      setImg(img.publicUrl as string);
    })();
  }, []);

  return (
    <View>
      <Text>{img}</Text>
      {img && (
        <Image source={{ uri: img }} style={{ width: 100, height: 100 }} />
      )}
    </View>
  );
};
