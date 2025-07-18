import QaButton from "@/components/QaButton";

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-primary mb-6 text-center">
        このサイトについて
      </h1>

      <div className="space-y-4 text-text leading-relaxed">
        <p>
          <strong>DOUJIN CAFE</strong> は、
          創作が大好きなすべての人のための、
          おしゃべり＆お悩み相談コミュニティです。
        </p>

        <p>
          「同じ趣味の仲間と、もっと気軽に話したい」<br />
          「匿名で繋がれる同人友達がいたらいいな」<br />
          「普段はなかなか話せないことも、安心して話せる場所がほしい」<br /><br />
          そんな気持ちから生まれた、個人運営のサービスです。
        </p>

        <p>
          わたし自身、漫画を描いていて、<br />
          「アイデアが浮かばない」「モチベが続かない」<br />
          「誰にも見せられない悩みがある」——<br />
          そんな日々をたくさん経験してきました。<br /><br />
          同じ気持ちを抱える誰かと、気軽に、気楽に繋がれる場所があればとずっと思っていました。
        </p>

        <p>
          一次創作も二次創作も歓迎。<br />
          イラスト、小説、漫画、推し語り、雑談――<br /><br />
          創作に関わることなら、なんでも投稿できます。
        </p>

        <p>
          また、通話機能もあり、文字だけでは伝えきれない想いや熱量を、  
          仲間と一緒に語り合うことができます。
        </p>

        <p>
          迷ったり悩んだりしたときも、  
          同じ趣味の誰かがきっと助けてくれる場所。<br /><br />
          あなたの「好き」を思いきり楽しめる時間を、ここで過ごしてくださいね。
        </p>

        <p className="text-right text-sm text-gray-600 mt-8">
          DOUJIN CAFE 管理人：ユズハ
        </p>
      </div>

      <QaButton />
    </div>
  );
}
