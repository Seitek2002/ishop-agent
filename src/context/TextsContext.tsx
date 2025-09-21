import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useGetPageTextsQuery } from "../services/api";
import { CompareLocaldata } from "../helpers/CompareLocaldata";

const DEFAULT_TEXTS: Record<string, { ru: string; ky: string }> = {
  promo_title_1: {
    ru: "Продавай товары магазинов и зарабатывай до 100 000 сом",
    ky: "Дүкөндөрдүн товарларын сат жана 100 000 сомго чейин тап"
  },
  earn_10_percent: {
    ru: "Вознаграждение до 40%",
    ky: "Сыйлык 40%га чейин"
  },
  promo_title_2: {
    ru: "С нами просто и удобно",
    ky: "Биз менен жөнөкөй жана ыңгайлуу"
  },
  bonus_5_percent: {
    ru: "Бонусы за активность",
    ky: "Активдүүлүк үчүн бонустар"
  },
  promo_title_3: {
    ru: "Надёжный партнёр",
    ky: "Ишенимдүү өнөктөш"
  },
  license: {
    ru: "Все продажи прозрачны",
    ky: "Баардык сатуу ачык-айкын"
  },
  cta_start_earning_1: {
    ru: "Начать зарабатывать",
    ky: "Тапканды баштоо"
  },
  btn_skip: {
    ru: "Пропустить",
    ky: "Өткөрүп жиберүү"
  }
};

type TextsMap = Record<string, { text: string; file?: string }>;

interface TextsContextValue {
  texts: TextsMap;
  t: (key: string) => string;
  getFile: (key: string) => string | undefined;
  loading: boolean;
  error: string | null;
}

const TextsContext = createContext<TextsContextValue | undefined>(undefined);

export const TextsProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, error } = useGetPageTextsQuery();

  // Инициализация из localStorage
  const localData = localStorage.getItem('pageTexts') || '{}';
  const [texts, setTexts] = useState<TextsMap>(() => {
    try {
      return JSON.parse(localData);
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (data?.results) {
      // Преобразуем results в TextsMap
      const newMap: TextsMap = {};
      data.results.forEach((item) => {
        newMap[item.key] = { text: item.text, file: item.file };
      });
      // Сравниваем и обновляем localStorage и state
      CompareLocaldata({
        oldData: localData,
        newData: newMap,
        localKey: 'pageTexts',
        setState: (d) => setTexts(typeof d === 'object' && d !== null ? d : {}),
      });
    }
    // eslint-disable-next-line
  }, [data]);

  const lang: 'ru' | 'ky' = (() => {
    const stored = localStorage.getItem('lang');
    return stored === 'ru' || stored === 'ky' ? stored : 'ky';
  })();

  const t = (key: string) =>
    texts[key]?.text || DEFAULT_TEXTS[key]?.[lang] || "";
  const getFile = (key: string) => texts[key]?.file;

  return (
    <TextsContext.Provider value={{ texts, t, getFile, loading: isLoading, error: error ? String(error) : null }}>
      {children}
    </TextsContext.Provider>
  );
};

export const useTexts = () => {
  const context = useContext(TextsContext);
  if (!context) {
    throw new Error("useTexts must be used within a TextsProvider");
  }
  return context;
};
