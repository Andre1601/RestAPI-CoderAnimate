module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      username: String,
      name: String,
      email: String,
      password: String,
      social: Array,
      Followers: Array,
      Following: Array,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Post = mongoose.model("user", schema);
  return Post;
};
