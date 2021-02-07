// must restart server whenever you make changes in next.config
module.exports = {
  env: {
    MONGO_SRV: "mongodb+srv://AdiJenkins:root@reactshoppingcart.boyhu.mongodb.net/test?retryWrites=true&w=majority",
    JWT_SECRET: "rhjhdjjsrbe33k4",
    CLOUDINARY_URL: "https://api.cloudinary.com/v1_1/adi17/image/upload",
    STRIPE_SECRET_KEY: "sk_test_wf2ZhiLmctf34whJ1W0yhR0F00YlOuF6HI"
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" }
        ]
      }
    ]
  }
};
