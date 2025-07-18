"use client";

import Link from "next/link";
import { Coffee } from "lucide-react";
import { Coiny, Geologica } from "next/font/google";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

const coiny = Coiny({
  weight: "400",
  subsets: ["latin"],
});

const geologica = Geologica({
  weight: ["400", "700"], // お好みで weight を指定
  subsets: ["latin"],
});

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/logout-complete");
  };

  const handleLogoClick = () => {
    router.push("/?page=1");
  };

  return (
    <header className="bg-primary text-white pt-2">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-2 md:py-4 px-4 md:px-8">
        {/* ロゴ */}
        <h1
          className={`text-2xl flex items-center gap-2 cursor-pointer ${coiny.className}`}
          onClick={handleLogoClick}
        >
          <Coffee className="w-6 h-6 relative -top-[1px]" />
          <span
            className={`hover:opacity-80 transition ${geologica.className}`}
          >
            DOUJIN CAFE
          </span>
        </h1>

        {/* ナビ */}
        <nav className="flex gap-5 text-sm">
          {user ? (
            <>
              <Link href="/mypage" className="hover:underline transition">
                マイページ
              </Link>
              <button
                onClick={handleLogout}
                className="hover:underline transition"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline transition">
                ログイン
              </Link>
              <Link href="/register" className="hover:underline transition">
                会員登録
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* サブタイトル */}
      <div className="bg-secondary py-2">
        <div className="max-w-7xl mx-auto py-1 md:py-1 px-2 md:px-8">
          <p className="text-center text-xs text-text font-semibold">
            匿名OK！創作してる人の交流コミュニティ
          </p>
        </div>
      </div>
    </header>
  );
}
