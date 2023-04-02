import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Button, FlatList, Image } from 'react-native';

const apiKey = '4668ed599b6ec549fd76e7d17f38ab1c';

const SearchScreen = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [photos, setPhotos] = useState([]);

  const handleSearch = () => {
    const apiUrl = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&text=${searchTerm}&per_page=99&format=json&nojsoncallback=1`;
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const photosArray = data.photos.photo.map(photo => {
          return {
            id: photo.id,
            title: photo.title,
            url: `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`,
          };
        });
        setPhotos(photosArray);
      })
      .catch(error => console.error(error));
  };

  const handlePhotoPress = photo => {
    navigation.navigate('SearchResult', { photo });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder='Search Photos'
        />
          <Button title='Search' onPress={handleSearch} color='rgb(27, 38, 59)'/>
      </View>
      <FlatList
        data={photos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.photoContainer}>
            <Image
              style={styles.photo}
              source={{ uri: item.url }}
              onPress={() => handlePhotoPress(item)}
            />
          </View>
        )}
        numColumns={3}
        contentContainerStyle={styles.photoList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 20,
  },
  textInput: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  photoContainer: {
    flex: 1,
    margin: 1,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: 120,
  },
  photoList: {
    padding: 5,
  },
});

export default SearchScreen;
