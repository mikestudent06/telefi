import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/search-bar";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";

export default function Home() {
  const router = useRouter()
  // const { data: trendingMovies, loading: trendingMoviesLoading, error: trendingMoviesError } = useFetch(() => getTrendingMovies())
  const { data: movies, loading: moviesLoading, error: moviesError } = useFetch(() => fetchMovies({ query: '' }))
  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute z-0 w-full" />
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}>
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
        {/* {moviesLoading || trendingMoviesLoading ? (<ActivityIndicator size={"large"} color={"#0000ff"} className="mt-10 self-center" />) */}
        {moviesLoading ? (<ActivityIndicator size={"large"} color={"#0000ff"} className="mt-10 self-center" />)
          : moviesError ? (<Text>Error: {moviesError?.message}</Text>)
          // : moviesError || trendingMoviesError ? (<Text>Error: {moviesError?.message || trendingMoviesError?.message}</Text>)
            : (<View className="flex-1 mt-5">
              <SearchBar onPress={() => router.push("/search")} placeholder="Search for a movie" />

              {/* {trendingMovies && (
                <View className="mt-10">
                  <Text className="text-lg text-white font-bold mb-3">
                    Trending Movies
                  </Text>
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mb-4 mt-3"
                    data={trendingMovies}
                    contentContainerStyle={{
                      gap: 26,
                    }}
                    renderItem={({ item, index }) => (
                      <TrendingCard movie={item} index={index} />
                    )}
                    keyExtractor={(item) => item.movie_id.toString()}
                    ItemSeparatorComponent={() => <View className="w-4" />}
                  />
                </View>
              )} */}
              <>
                <Text className="text-lg text-white font-bold mt-5 mb-3">Latest Movies</Text>
                <FlatList
                  data={movies}
                  renderItem={({ item }) => (
                    <MovieCard
                      id={item.id}
                      poster_path={item.poster_path}
                      title={item.title}
                      vote_average={item.vote_average}
                      release_date={item.release_date}
                    />
                  )}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={2}
                  columnWrapperStyle={{
                    justifyContent: "center",
                    gap: 20,
                    paddingRight: 5,
                    marginBottom: 10
                  }}
                  className="mt-2 pb-32"
                  scrollEnabled={false}
                />
              </>
            </View>)}
      </ScrollView>
    </View>
  );
}
