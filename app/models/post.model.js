module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      uid: Object,
      title: String,
      // image: Blob,
      code: String,
      description: String,
      tags: Array,
      viewed: Number,
      liked: Number,
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
