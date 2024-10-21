import Article from "@models/article.model.js";

class ArticleRepository {
    async filter(text, tags) {
        const article = await new Article();

        // Search for text in the article title (case insensitive)
        const query = {
            title: { $regex: String(text), $options: "i" },
        };

        // Optionally, the article must ALSO contain one of the given tags
        if (tags.length) {
            query.$or = [];

            for (let tag of tags) {
                query.$or.push({ tags: { $regex: String(tag) } });
            }
        }

        return await article.find(query);
    }
}

export default ArticleRepository;
