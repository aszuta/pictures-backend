export interface Comment {
    id: number,
    postId: number,
    userId: number,
    name: string,
    content: string,
    createdAt: Date,
}