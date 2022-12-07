module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      username: String,
      name: String,
      email: String,
      password: String,
      location: String,
      bio: String,
      social: Array,
      followers: Array,
      following: Array,
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
