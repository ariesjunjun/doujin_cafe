export function RoomCard({
  id,
  name,
  isLocked,
  currentMembers,
  roomUrl,
}: {
  id: string;
  name: string;
  isLocked: boolean;
  currentMembers: number;
  roomUrl: string;
}) {
  return (
    <div
      className="
        relative                 /* 子要素の位置調整用に相対配置 */
        rounded-xl              /* 角丸（Extra Large） */
        p-4                     /* 内側の余白: 1rem (16px) */
        bg-room                 /* カスタムの背景色 (Tailwind の設定で定義されている前提) */
        shadow                  /* 通常のシャドウ */
        hover:shadow-md         /* ホバー時に中程度のシャドウに変化 */
        transition              /* 状態変化（ホバーなど）に滑らかさを追加 */
        flex flex-col           /* Flexbox で縦方向に並べる */
        justify-between         /* 上部と下部を上下に分けて配置 */
      "
    >
      {/* 上部: タイトルや情報 */}
      <div>
        <div className="flex justify-between items-center mb-1">
          {/* 
            flex: 横並びにする
            justify-between: 両端に配置（タイトルとロックアイコン）
            items-center: 垂直方向の中央揃え
            mb-1: 下余白（4px）
          */}
          <h3 className="text-lg font-semibold text-text">
            {/* text-lg: 少し大きめの文字サイズ, font-semibold: 中太字 */}
            {name}
          </h3>
          {isLocked && (
            <span className="text-sm text-red-500 font-medium">
              {/* 
                text-sm: 小さめ文字
                text-red-500: 赤系の中間色
                font-medium: 少し太め
              */}
              🔒
            </span>
          )}
        </div>
        <p className="text-sm text-primary">
          {/* text-sm: 小さい文字, text-gray-600: グレーのやや濃い色 */}
          人数: {currentMembers}人
        </p>
      </div>

      {/* 下部: ルームに参加ボタン */}
      <div className="flex justify-end mt-1">
        {/* 
          flex: 横並び（今回はボタン1つだけど整列に便利）
          justify-end: 右寄せ
          mt-2: 上マージン（8px）→余白を控えめに
        */}
        <a
          href={roomUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-block            /* インラインブロック：パディングや幅を扱いやすく */
            bg-primary              /* カスタムのプライマリ色（Tailwind拡張） */
            text-white              /* 白文字 */
            px-4 py-2               /* 左右: 1rem 上下: 0.5rem のパディング */
            rounded                 /* デフォルトの角丸 */
            font-medium             /* 少し太めの文字 */
            hover:bg-text   /* ホバー時に濃いプライマリ色に変化 */
            transition              /* ホバーの色変化を滑らかに */
            text-sm                 /* 小さめの文字サイズ */
          "
        >
          ルームに参加
        </a>
      </div>
    </div>
  );
}
