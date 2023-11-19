<template>
  <div class="q-pa-lg absolute-center" style="max-width: 700px">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
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
        <q-chip
          v-for="genre in allGenres"
          :key="genre"
          outline
          clickable
          :selected="selectedGenres.includes(genre)"
          @click="toggleGenre(genre)"
          class="q-mr-sm"
        >
          {{ genre }}
        </q-chip>
      </div>

      <!-- Submit and Reset buttons -->
      <div>
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { addMovieToDB } from 'src/database/db';
import { Movie } from 'src/types/movie';

export default {
  name: 'AddMoviePage',
  setup() {
    const $q = useQuasar();
    const router = useRouter();

    const title = ref('');
    const director = ref('');
    const description = ref('');
    const selectedGenres = ref<string[]>([]);
    const allGenres = ['Drama', 'Action', 'Animation', 'Sci-Fi', 'Horror'];

    const onSubmit = async () => {
      if (
        title.value &&
        director.value &&
        description.value &&
        selectedGenres.value.length > 0
      ) {
        const newMovie: Movie = {
          title: title.value,
          director: director.value,
          summary: description.value,
          genres: selectedGenres.value,
        };

        try {
          await addMovieToDB(newMovie);
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Movie added successfully',
            position: 'top',
          });

          router.push('/');
        } catch (error) {
          $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'error',
            message: `Failed to add movie: ${error}`,
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

    const onReset = () => {
      title.value = '';
      director.value = '';
      description.value = '';
      selectedGenres.value = [];
    };

    const toggleGenre = (genre: string) => {
      const index = selectedGenres.value.indexOf(genre);
      if (index === -1) {
        selectedGenres.value.push(genre);
      } else {
        selectedGenres.value.splice(index, 1);
      }
    };

    return {
      title,
      director,
      description,
      selectedGenres,
      allGenres,
      onSubmit,
      onReset,
      toggleGenre,
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
