const Slug = ({ params }: { params: { artists: string } }) => {
  return (
    <div>
      <h1>Artists profile Page</h1>
      with all lists of songs
      {params.artists}
    </div>
  );
};

export default Slug;
