<template>
  <div class="q-pa-lg absolute-center" style="max-width: 700px">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <!-- Input for Movie Title -->
      <q-input
        outlined
        v-model="title"
        label="Movie Title"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <!-- Input for Movie Director -->
      <q-input
        outlined
        v-model="director"
        label="Movie Director"
        lazy-rules
        :rules="[
          (val) => (val !== null && val !== '') || 'Please type Movie Director',
        ]"
      />

      <!-- Textarea for Movie Description -->
      <q-input
        outlined
        type="textarea"
        v-model="description"
        label="Movie Description"
        lazy-rules
        :rules="[
          (val) =>
            (val !== null && val !== '') || 'Please type Movie Description',
        ]"
      />

      <!-- Chips for selecting genres -->
      <div class="q-mb-md genre-chips-container">
        <div v-for="genre in allGenres" :key="genre" class="q-mr-sm q-mb-sm">
          <q-chip
            outline
            clickable
            :selected="selectedGenres.includes(genre)"
            @click="toggleGenre(genre)"
            class="q-mr-sm"
          >
            {{ genre }}
          </q-chip>
        </div>
      </div>

      <!-- Submit and Delete buttons -->
      <div class="row justify-start q-gutter-x-sm">
        <q-btn label="Update" type="submit" color="primary" />
        <q-btn
          label="Delete"
          type="button"
          color="negative"
          @click="confirmDeletion"
        />
      </div>
    </q-form>
  </div>

  <q-dialog v-model="deleteDialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">Delete Movie</div>
      </q-card-section>
      <q-card-section>
        Are you sure you want to delete "{{ title }}"?
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn flat label="Yes, Delete" color="negative" @click="deleteMovie" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter, useRoute } from 'vue-router';
import {
  getMovieById,
  updateMovieInDB,
  deleteMovieFromDB,
} from 'src/database/db';

export default {
  name: 'EditMoviePage',
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const route = useRoute();
    const movieId = ref(route.params.movieId);
    const deleteDialog = ref(false);
    const title = ref('');
    const director = ref('');
    const description = ref('');
    const selectedGenres = ref<string[]>([]);
    const allGenres = ['Drama', 'Action', 'Animation', 'Sci-Fi', 'Horror'];

    const loadMovieDetails = async (id: string | number) => {
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      if (!isNaN(numericId)) {
        const movie = await getMovieById(numericId);
        if (movie) {
          title.value = movie.title;
          director.value = movie.director;
          description.value = movie.summary;
          selectedGenres.value = movie.genres;
        } else {
          console.error('No movie found with ID:', numericId);
        }
      } else {
        console.error('Invalid movie ID:', id);
      }
    };

    watch(
      () => route.params.movieId,
      (newId) => {
        if (newId) {
          loadMovieDetails(Array.isArray(newId) ? newId[0] : newId);
        }
      },
      { immediate: true }
    );

    const onSubmit = async () => {
      if (
        title.value &&
        director.value &&
        description.value &&
        selectedGenres.value.length > 0
      ) {
        const updatedMovie = JSON.parse(
          JSON.stringify({
            id: Number(movieId.value),
            title: title.value,
            director: director.value,
            summary: description.value,
            genres: selectedGenres.value,
          })
        );

        try {
          await updateMovieInDB(updatedMovie);
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Movie updated successfully',
            position: 'top',
          });

          router.push('/'); // Kembali ke halaman utama setelah pembaruan berhasil
        } catch (error) {
          $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: `Failed to update movie: ${error}`,
            position: 'top',
          });
        }
      } else {
        $q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Please fill in all fields',
          position: 'top',
        });
      }
    };

    const toggleGenre = (genre: string) => {
      const index = selectedGenres.value.indexOf(genre);
      if (index === -1) {
        selectedGenres.value.push(genre);
      } else {
        selectedGenres.value.splice(index, 1);
      }
    };

    const confirmDeletion = () => {
      deleteDialog.value = true;
    };

    const deleteMovie = async () => {
      try {
        const id = Array.isArray(movieId.value)
          ? movieId.value[0]
          : movieId.value;
        await deleteMovieFromDB(id);

        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Movie deleted successfully',
          position: 'top',
        });
        router.push('/');
      } catch (error) {
        $q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: `Failed to delete movie: ${error}`,
          position: 'top',
        });
      }
    };

    return {
      title,
      director,
      description,
      selectedGenres,
      allGenres,
      onSubmit,
      toggleGenre,
      deleteDialog,
      confirmDeletion,
      deleteMovie,
    };
  },
};
</script>

<style lang="scss" scoped>
.genre-chips-container {
  display: flex;
  flex-wrap: wrap;
}
</style>
