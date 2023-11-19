<template>
  <div class="q-pa-md" style="max-width: 700px; margin: auto">
    <q-input outlined v-model="searchText" label="Search By Title" />

    <q-layout
      view="lhh LpR lff"
      container
      style="height: 70vh"
      class="border-none"
    >
      <q-page-container>
        <q-page padding>
          <MovieCard
            v-for="(movie, index) in filteredCardTitles"
            :key="index"
            :movie="movie as Partial<Movie>"
            :navigate="navigateToEdit"
          />
        </q-page>
      </q-page-container>
    </q-layout>

    <!-- Tambahkan router-link ke halaman /add -->
    <router-link to="/add">
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="add" color="green-10" />
      </q-page-sticky>
    </router-link>
  </div>
</template>

<script lang="ts">
import MovieCard from '/src/components/MovieCard.vue';
import { ref, Ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Movie } from 'src/types/movie';

export default {
  name: 'IndexPage',
  components: {
    MovieCard,
  },
  setup() {
    const router = useRouter();
    const searchText = ref('');
    type MovieSummary = Partial<Movie>;
    const cardTitles: Ref<MovieSummary[]> = ref([]);

    const loadMoviesFromDB = async () => {
      const openRequest = indexedDB.open('MoviesDatabase', 1);

      openRequest.onerror = (event) => {
        const request = event.target as IDBRequest; // Type assertion ke IDBRequest
        if (request.error) {
          console.error('Database error:', request.error);
        } else {
          console.error('Database error: Unknown error');
        }
      };

      openRequest.onsuccess = (event) => {
        if (!event.target) {
          console.error('Database open request was unsuccessful');
          return;
        }

        const db = (event.target as IDBOpenDBRequest).result; // Type assertion
        const transaction = db.transaction(['movies'], 'readonly');
        const store = transaction.objectStore('movies');
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
          cardTitles.value = getAllRequest.result.map((movie) => ({
            id: movie.id,
            title: movie.title,
            director: movie.director,
            genres: movie.genres,
          }));
        };
      };
    };

    // Fungsi untuk navigasi ke halaman edit
    const navigateToEdit = (movie: Partial<Movie>) => {
      router.push({ name: 'EditMovie', params: { movieId: movie.id } });
    };

    onMounted(() => {
      loadMoviesFromDB();
    });

    const filteredCardTitles = computed(() => {
      return cardTitles.value.filter(
        (movie) =>
          movie.title &&
          movie.title.toLowerCase().includes(searchText.value.toLowerCase())
      );
    });

    return {
      searchText,
      filteredCardTitles,
      navigateToEdit,
    };
  },
};
</script>

<style scoped>
.clickable-card {
  cursor: pointer;
}
</style>
