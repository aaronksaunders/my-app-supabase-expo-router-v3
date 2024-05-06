import { Image } from "expo-image";
import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { getImage } from "~/services/supabase-service";
import { Tables } from "~/types/supabase";


/**
 * Renders an image component with the specified width and height.
 * If the width and height are not specified, the image will be displayed in its original size.
 * If the width and height are specified, the image will be resized to fit the specified dimensions.
 * 
 * we add this option to deal with large images that may not fit the screen, the transformation will
 * be done on the server side which is more efficient. The problem with this approach is that it
 * transforms all images instead of just the ones that need it.
 *
 * @param image - The image data.
 * @param width - The width of the image (optional).
 * @param height - The height of the image (optional).
 */
export const RenderImage = ({
    image,
    width,
    height,
}: {
    image: Tables<"images">;
    width?: number;
    height?: number;
}) => {
    const [img, setImg] = useState<string>();

    useEffect(() => {
        (async () => {
            const img = await getImage(image.name!, width, height);
            setImg(img?.signedUrl as string);
        })();
    }, []);

    return (
        <View style={styles.imageContainer}>
            {img && (
                <Image
                    style={styles.image}
                    source={{ uri: img }}
                    allowDownscaling={false}
                    contentFit="contain"
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
  imageContainer: {
    display: "flex",
    flex: 1,
    backgroundColor: "transparent",
    borderColor: "lightgray",
    borderWidth: 1,
    marginTop: 12,
    marginBottom: 20,
    marginVertical: 5,
  },
  image: { flex: 1, width: "100%", height: "100%" },
});
