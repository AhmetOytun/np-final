import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AlbumCard({
  id,
  title,
  artist,
  rating,
  image,
}: {
  id: number;
  title: string;
  artist: string;
  rating: number;
  image: string;
}) {
  const router = useRouter();

  return (
    <div
      className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden hover:cursor-pointer"
      onClick={() => router.push(`/album/${id}`)}
    >
      <Image src={image} alt={title} width={400} height={400} />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{artist}</p>
        <div className="font-medium text-sm">{rating}</div>
      </div>
    </div>
  );
}
