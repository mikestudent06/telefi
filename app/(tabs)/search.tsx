import MovieCard from '@/components/MovieCard';
import SearchBar from '@/components/search-bar';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { fetchMovies } from '@/services/api';
import { updateSearchCount } from '@/services/appwrite';
import useFetch from '@/services/useFetch';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const fetchFn = useCallback(() => fetchMovies({ query: searchQuery }), [searchQuery]);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch,
    reset
  } = useFetch<Movie[]>(fetchFn, false);

  const changeText = (text: string): void => {
    setSearchQuery(text);
  };

  // Debounce search requests
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        refetch();
      } else {
        reset();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [refetch, reset, searchQuery]);

  // useEffect(() => {
  //   const updateCount = async () => {
  //     if (movies && movies.length > 0) {
  //       try {
  //         await updateSearchCount(searchQuery, movies[0]);
  //       } catch (error) {
  //         console.error("Failed to update search count:", error);
  //         // Consider showing a toast notification or other feedback to user
  //       }
  //     }
  //   };

  //   if (searchQuery.trim() && (movies?.length ?? 0) > 0) {
  //     updateCount();
  //   }
  // }, [movies, searchQuery]);

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute z-0 w-full" />
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'center',
          gap: 20,
          paddingRight: 5,
          marginVertical: 16,
          marginBottom: 10,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>
            <View className="my-5">
              <SearchBar
                value={searchQuery}
                placeholder="Search movies..."
                onChangeText={changeText}
              />
            </View>
            {moviesLoading && (
              <ActivityIndicator size="large" color="#0000ff" className="my-3" />
            )}
            {moviesError && (
              <Text className="text-red-500">{moviesError.message}</Text>
            )}
            {!moviesLoading && !moviesError && searchQuery.trim() && movies && movies.length > 0 && (
              <Text className='text-4xl text-white font-bold'>
                Search Results for {' '}
                <Text className='text-accent'>{searchQuery}</Text>
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          !moviesLoading && !moviesError && searchQuery.trim() ? (
            <Text className="text-center text-white mt-10">No movies found</Text>
          ) : null
        }
      />
    </View>
  );
};

export default Search;