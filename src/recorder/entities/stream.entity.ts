// create table public.stream
// (
//     stream_id        varchar(255)             not null
//         primary key,
//     title            varchar(255),
//     is_live          boolean,
//     m3u8_address     varchar(255),
//     storage_provider varchar(255),
//     download_address varchar(255),
//     start_at         timestamp with time zone,
//     end_at           timestamp with time zone,
//     created_at       timestamp with time zone not null,
//     updated_at       timestamp with time zone not null,
//     streamer_id      integer,
//     deleted_at       timestamp with time zone
// );

// comment on table public.stream is '유달린 생방송';

// comment on column public.stream.stream_id is '스트림 ID';

// comment on column public.stream.title is '최초 방송 제목';

// comment on column public.stream.is_live is '현재 생방송 중 여부';

// comment on column public.stream.m3u8_address is 'm3u8 주소';

// comment on column public.stream.storage_provider is '저장소 제공자';

// comment on column public.stream.download_address is '다운로드 주소';

// comment on column public.stream.start_at is '시작일시';

// comment on column public.stream.end_at is '종료일시';

// alter table public.stream
//     owner to postgres;

// create index stream_created_at_index
//     on public.stream (created_at);

// create index stream_start_at_index
//     on public.stream (start_at);

// create index stream_streamer_id_index
//     on public.stream (streamer_id);

// create index stream_title_index
//     on public.stream (title);

import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'stream',
  comment: '생방송',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Stream extends Model<Stream> {
  @Column({
    field: 'stream_id',
    primaryKey: true,
    comment: '스트림 ID',
  })
  streamId: string;

  @Column({
    field: 'title',
    comment: '최초 방송 제목',
  })
  title: string;

  @Column({
    field: 'is_live',
    comment: '현재 생방송 중 여부',
  })
  isLive: boolean;

  @Column({
    field: 'm3u8_address',
    comment: 'm3u8 주소',
  })
  m3u8Address: string;

  @Column({
    field: 'storage_provider',
    comment: '저장소 제공자',
  })
  storageProvider: string;

  @Column({
    field: 'download_address',
    comment: '다운로드 주소',
  })
  downloadAddress: string;

  @Column({
    field: 'start_at',
    comment: '시작일시',
  })
  startAt: Date;

  @Column({
    field: 'end_at',
    comment: '종료일시',
  })
  endAt: Date;

  @Column({
    field: 'streamer_id',
    comment: '스트리머 ID',
  })
  streamerId: number;

  @Column({
    field: 'deleted_at',
    comment: '삭제일시',
  })
  deletedAt: Date;

  @Column({
    field: 'thumbnail_url',
    comment: '썸네일 URL',
  })
  thumbnailUrl: string;
}
