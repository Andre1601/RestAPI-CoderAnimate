module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      uid: Object,
      title: String,
      // image: Blob,
      code: Array,
      description: String,
      tags: Array,
      viewed: Array,
      liked: Array,
      published: Boolean,
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Post = mongoose.model("post", schema);
  return Post;
};
