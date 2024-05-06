import {
  Alert,
  Button,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  imagesFetcher,
  StorageObject,
  uploadToSupabase,
} from "~/services/supabase-service";
import { ScrollView } from "react-native-gesture-handler";
import { RenderImage } from "./RenderImage";
import { Tables } from "~/types/supabase";

/**
 * Renders the TabImagesScreen component.
 * This component allows the user to select and upload images.
 * It displays the selected image, along with a list of all uploaded images.
 */
export default function TabImagesScreen() {
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset>();
  const [images, setImages] = useState<Tables<"images">[] | undefined>(
    undefined
  );

  /**
   * Displays an alert with the specified title and message.
   * @param {string} title - The title of the alert.
   * @param {string} message - The message to be displayed in the alert.
   */
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
      setImages(data);
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
      showAlert("Notice", "No image selected by the user.");
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
      setImages(data);
      setImage(undefined);
    } else {
      console.error(error);
      showAlert("Error Fetching Images", (error as Error).message);
    }
  };

  // calc width and height of image for the transformation
  const width = Math.round(Dimensions.get("window").width) - 32;
  console.log("[image dimesnsion] ==>", width);

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* preview section  */}
        <Text>{!image ? "No image selected" : image.fileName}</Text>
        {image && <Image source={image} style={styles.imagePreview} />}
        <View style={styles.previewBtnContainer}>
          <Button title="Pick" onPress={pickImageAsync} />
          <Button title="Clear" onPress={() => setImage(undefined)} />
          <Button title="Upload" onPress={handleUpload} />
        </View>

        {/* images section  */}
        <View>
          <Text style={styles.containerTitle}>All Images</Text>
          <View>
            {images?.map((image: Tables<"images">) => {
              return (
                <View key={image.id}>
                  <Text style={styles.listItemText}>ID: {image.id}</Text>
                  <Text style={styles.listItemText}>NAME: {image.name}</Text>
                  <Text style={styles.listItemText}>
                    OWNER: {image.owner_id}
                  </Text>
                  <Text style={styles.listItemText}>
                    PUBLIC: {image.is_public.toString()}
                  </Text>
                  <View style={styles.listItemImage}>
                    <RenderImage
                      image={image}
                      width={width * 2}
                      height={200 * 2}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", gap: 16, marginTop: 32 },
  containerTitle: { fontSize: 16, fontWeight: "bold" },
  imagePreview: { width: 200, height: 200 },
  previewBtnContainer: { display: "flex", flexDirection: "row", gap: 16 },
  listItemImage: { flex: 1, width: "100%", height: 300 },
  listItemText: { fontSize: 12 },
});
