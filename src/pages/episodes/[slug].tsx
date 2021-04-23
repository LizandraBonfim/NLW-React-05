import React from "react";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import Link from "next/link";
import Image from "next/image";

import api from "../../services/api";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

import styles from "./episode.module.scss";

type EpisodeProps = {
  episode: Episode;
};

type Episode = {
  id: string;
  url: string;
  title: string;
  members: string;
  duration: number;
  thumbnail: string;
  description: string;
  publishedAt: string;
  durationAsString: string;
};

export default function Episode({ episode }: EpisodeProps) {
  const router = useRouter();

  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href={`/`}>
          <button type="button">
            <img src="/arrow-left.svg" alt="Arrow-left" />
          </button>
        </Link>

        <Image
          src={episode.thumbnail}
          width={700}
          height={160}
          objectFit="cover"
        />

        <button type="button">
          <img src="/play.svg" alt="Play" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>

        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params;
  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), "d MMM yy", {
      locale: ptBR,
    }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file,
  };
  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24,
  };
};
