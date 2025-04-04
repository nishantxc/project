"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { formatDistance } from "date-fns";
import { Post } from "../app/types/post";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-2xl font-bold hover:text-primary transition-colors mb-2">
            {post.title}
          </h2>
        </Link>
        <p className="text-muted-foreground">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src={post.author.image}
            alt={post.author.name}
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="text-sm font-medium">{post.author.name}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <time className="text-sm">
            {formatDistance(new Date(post.date), new Date(), {
              addSuffix: true,
            })}
          </time>
        </div>
      </CardFooter>
    </Card>
  );
}
