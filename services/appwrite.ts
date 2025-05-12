import {
  Client,
  ID,
  Databases,
  Query,
} from "react-native-appwrite";

// Configuration centralisée
export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.mimo.telefi",
  projectID: "681fbb780017ff035e35",
  databaseID: "6820c4bc0014f70feba6",
  collectionID: "6820c4ef0017fbaf12e9",
};

// Initialisation du client Appwrite
const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectID)
  .setPlatform(config.platform);

const databases = new Databases(client);

/**
 * Met à jour le nombre de recherches d’un film donné
 */
export const updateSearchCount = async (
  query: string,
  movie: Movie
): Promise<void> => {
  if (!query || !movie) {
    console.log("Invalid query or movie data");
    return;
  }

  try {
    console.log("Updating search count for:", query);
    const result = await databases.listDocuments(
      config.databaseID,
      config.collectionID,
      [Query.equal("searchTerm", query)]
    );

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await databases.updateDocument(
        config.databaseID,
        config.collectionID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await databases.createDocument(
        config.databaseID,
        config.collectionID,
        ID.unique(),
        {
          searchTerm: query,
          movie_id: movie.id,
          title: movie.title,
          count: 1,
          poster_url: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null,
        }
      );
    }
    console.log("Search count updated successfully");
  } catch (error) {
    console.error("Error updating search count:", error);
  }
};

/**
 * Récupère les films les plus recherchés
 */
export const getTrendingMovies = async (): Promise<TrendingMovie[]> => {
  try {
    console.log("Fetching trending movies");
    const result = await databases.listDocuments(
      config.databaseID,
      config.collectionID,
      [Query.limit(5), Query.orderDesc("count")]
    );

    console.log("Trending movies fetched successfully");
    return result.documents.map((doc) => ({
      searchTerm: doc.searchTerm,
      movie_id: doc.movie_id,
      title: doc.title,
      count: doc.count,
      poster_url: doc.poster_url,
    })) as TrendingMovie[];
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
};
