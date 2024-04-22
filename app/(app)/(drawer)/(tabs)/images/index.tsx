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
      const images = await imagesFetcher();
      setImages(images);
      console.log(images);
    })();
  }, []);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
      setImage(result?.assets[0]);
    } else {
      alert("You did not select any image.");
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", gap: 16, marginTop: 32 }}>
      <Text>{!image ? "No image selected" : image.fileName}</Text>
      {image && <Image source={image} style={{ width: 200, height: 200 }} />}
      <View style={{ flexDirection: "row", gap: 16 }}>
        <Button
          title="Pick an image from camera roll"
          onPress={pickImageAsync}
        />
        <Button title="Clear Image" onPress={() => setImage(undefined)} />
        <Button
          title="UPLOAD IMAGE"
          onPress={async () => {
            await uploadToSupabase(image?.uri!, image?.fileName!, image?.mimeType!);
            const newImages = await imagesFetcher();
            setImages(newImages);
            setImage(undefined);
          }}
        />
      </View>
      <View style={{ display: "flex" }}>
        <Text style={{fontSize:18, fontWeight: 'bold', marginBottom:24}}>All Images</Text>
        <View style={{width: 400, gap:8}}>

        {images.map((image) => (
          <Text key={image.id}>{image.name}</Text>
        ))}
        </View>
      </View>
    </View>
  );
}
