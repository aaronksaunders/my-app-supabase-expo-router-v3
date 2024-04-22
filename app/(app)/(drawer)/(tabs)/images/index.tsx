import { Button, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { imagesFetcher, uploadToSupabase } from "~/services/supabase-service";

export default function TabImagesScreen() {
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset>();
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await imagesFetcher();
      setImages(data!);
      console.log(images);
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
      alert("You did not select any image.");
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
      image as ImagePicker.ImagePickerAsset
    );
    if (uploadResp.error) {
      console.error(uploadResp.error);
      alert(`Error Uploading Image ${(uploadResp.error as Error).message}`);
      return;
    } else {
      alert("Image Uploaded Successfully");
    }

    // if uploaded successfully, fetch images again
    const { data, error } = await imagesFetcher();
    if (!error) {
      setImages(data!);
      setImage(undefined);
    } else {
      console.error(error);
      alert(`Error Fetching Images ${(error as Error).message}`);
    }
  };

  return (
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
          {images.map((image) => (
            <Text key={image.id}>{image.name}</Text>
          ))}
        </View>
      </View>
    </View>
  );
}
