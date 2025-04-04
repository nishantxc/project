export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  author: {
    name: string;
    image: string;
  };
  date: string;
  tags: string[];
}