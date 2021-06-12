
export default{
  render(movie: any){
    return{
      id: movie.id,
      title: movie.title,
      poster: `${process.env.IMAGE_URL}${movie.poster_path}`
    }
  },
  renderMany(movies: any){
    return movies.map(movie => this.render(movie));
  },
  renderDetails(movie: any, inList: any){
    let genres = '';
    movie.genres.map(genre => {
      if(genres === '') genres += genre.name
      else genres += `, ${genre.name}`
    });
    const number_date = movie.release_date.split('-');
    const release_data = number_date[2] + '/' + number_date[1] + '/' + number_date[0];

    return {
      id: movie.id,
      title: movie.title,
      original_title: movie.original_title,
      poster: `${process.env.IMAGE_URL}${movie.poster_path}`,
      overview: movie.overview,
      genres,
      release_data,
      inList
    }
  }
}