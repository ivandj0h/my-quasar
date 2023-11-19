<template>
  <q-card class="q-mb-md clickable-card" @click="navigateToEdit">
    <!-- Konten komponen, sesuaikan dengan kebutuhan -->
    <q-card-section>
      <div class="text-h5 q-mt-sm q-mb-xs">{{ movie.title }}</div>
      <div class="text-caption text-grey">{{ movie.director }}</div>
      <div class="row justify-end">
        <div v-if="movie.genres" class="text-overline text-orange-9">
          {{ movie.genres.join(' / ') }}
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Movie } from 'src/types/movie';

export default defineComponent({
  name: 'MovieCard',
  props: {
    movie: {
      type: Object as PropType<Partial<Movie>>,
      required: true,
    },
    navigate: {
      type: Function as PropType<(movie: Movie) => void>, // Perbaiki tipe argumen
      default: () => undefined,
    },
  },
  methods: {
    navigateToEdit() {
      if (this.navigate) {
        this.navigate(this.movie as Movie);
      }
    },
  },
});
</script>

<style scoped>
.clickable-card {
  cursor: pointer;
}
</style>
