import { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiKey = '4668ed599b6ec549fd76e7d17f38ab1c';
const userId = '120552517@N03';

const HomeScreen = () => {
  const [photos, setPhotos] = useState([]);
  const [lastViewed, setLastViewed] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(
          `https://www.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=${apiKey}&user_id=${userId}&format=json&nojsoncallback=1`
        );
        const json = await response.json();
        setPhotos(json.photos.photo);
        console.log(json);

        // Get the last viewed image URI from AsyncStorage
        const storedUri = await AsyncStorage.getItem('lastViewed');
        if (storedUri) {
          setLastViewed(storedUri);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPhotos();
  }, []);

  const handleImageLoad = async (event, uri) => {
    setLastViewed(uri);
    try {
      await AsyncStorage.setItem('lastViewed', uri);
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <FastImage
        style={styles.image}
        source={{
          uri: `https://live.staticflickr.com/${item.server}/${item.id}_${item.secret}.jpg`,
          priority: FastImage.priority.normal,
          cache: FastImage.cacheControl.immutable,
        }}
        resizeMode={FastImage.resizeMode.cover}
        fallback={require('./fallback.png')}
        onLoad={(event) =>
          handleImageLoad(
            event,
            `https://live.staticflickr.com/${item.server}/${item.id}_${item.secret}.jpg`
          )
        }
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        numColumns={3}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomColor: "#003566",
    borderWidth: 2,
  },
  imageContainer: {
    flex: 1,
    margin: 1,
  },
  image: {
    flex: 1,
    aspectRatio: 1,
  },
  
});

export default HomeScreen;
