import { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, Button, Pressable } from 'react-native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';

const apiKey = '4668ed599b6ec549fd76e7d17f38ab1c';
const userId = '120552517@N03';

const HomeScreen = ({ navigation }) => {
  const [photos, setPhotos] = useState([]);
  const [lastViewed, setLastViewed] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isConnected, setIsConnected] = useState(true);


//Fetch Photos in HomeScreen
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(
          `https://www.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=${apiKey}&user_id=${userId}&format=json&nojsoncallback=1&page=${pageNumber}`
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
  }, [pageNumber]);

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

  const handleNextPage = () => {
    setPageNumber(pageNumber + 1);
  };

  const handlePreviousPage = () => {
    setPageNumber(pageNumber - 1);
  };

  const handleNextNextPage = () => {
    setPageNumber(pageNumber + 2);
  };

  const handlePreviousPreviousPage = () => {
    setPageNumber(pageNumber - 1);
  };

  const handlePage = () => {
    setPageNumber(pageNumber);
  };


  


  const footerComponent = () => {
    return (
      <View style={styles.footerContainer}>
        <View style={{flexDirection:"row", alignItems: "center", justifyContent:"space-between", marginBottom: 16, paddingHorizontal: 10}}>
        <AntDesign name="leftcircle" size={40} color="#001d3d" onPress={handlePreviousPage}/>

        {pageNumber > 2 ?
        
        (<Pressable onPress={handlePreviousPreviousPage} style={{ backgroundColor: "#778DA9",width: 30, height: 30, borderRadius: 50, overflow: 'hidden'}}>
          <Text style={{textAlign: "center", color: "white",fontSize: 22,fontWeight: "600", bottom: 3}}>
            {pageNumber-2}
          </Text>
        </Pressable>): 
        <></>}

      {pageNumber > 1 ?

        (<Pressable onPress={handlePreviousPage} style={{ backgroundColor: "#415A77",width: 30, height: 30, borderRadius: 50, overflow: 'hidden'}}>
          <Text style={{textAlign: "center", color: "white",fontSize: 22,fontWeight: "600", bottom: 3}}>
            {pageNumber-1}
          </Text>
        </Pressable>):
        <></>}

        
        <Pressable onPress={handlePage} style={{ backgroundColor: "#001d3d",width: 30, height: 30, borderRadius: 50, overflow: 'hidden'}}>
          <Text style={{textAlign: "center", color: "white",fontSize: 22,fontWeight: "600", bottom: 3}}>
            {pageNumber}
          </Text>
        </Pressable>

        <Pressable onPress={handleNextPage} style={{ backgroundColor: "#415A77",width: 30, height: 30, borderRadius: 50, overflow: 'hidden'}}>
          <Text style={{textAlign: "center", color: "white",fontSize: 22,fontWeight: "600", bottom: 3}}>
            {pageNumber+1}
          </Text>
        </Pressable>

        <Pressable onPress={handleNextNextPage} style={{ backgroundColor: "#778DA9",width: 30, height: 30, borderRadius: 50, overflow: 'hidden'}}>
          <Text style={{textAlign: "center", color: "white",fontSize: 22,fontWeight: "600", bottom: 3}}>
            {pageNumber+2}
          </Text>
        </Pressable>

        <AntDesign name="rightcircle" size={40} color="#001d3d" onPress={handleNextPage}/>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={photos.slice(0, 15)} // Only show the first 15 items
        numColumns={3}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled={true}
        ListFooterComponent={footerComponent}
        initialNumToRender={15}
        maxToRenderPerBatch={15}
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
  footerContainer: {
    padding: 20,
  },
});

export default HomeScreen;
