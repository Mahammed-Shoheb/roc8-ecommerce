"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { getAuthUser } from "~/utils/getAuthUser";
import {
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi2";
import CheckboxInput from "./_components/CheckboxInput";
import { api } from "~/trpc/react";
import { toast } from "react-toastify";
import Loading from "./_components/Loading";
import { readFromStorage } from "~/utils/storage";
import type { data } from "~/utils/storage";
import { useRouter } from "next/navigation";

export type Categories = {
  id: string;
  name: string;
  isChecked: boolean;
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [categories, setCategories] = useState<Categories[]>();
  const [numOfPages, setNumOfPages] = useState(5);
  const [page, setPage] = useState(1);
  const { mutate: getDataFn } = api.categories.getAllCategories.useMutation({
    onMutate() {
      setLoading(true);
    },
    onSettled() {
      setLoading(false);
    },
    onError(error) {
      toast.error(error.message);
    },
    onSuccess(data) {
      setCategories(data.categories);

      setNumOfPages(data.numOfPages);
    },
  });

  useLayoutEffect(() => {
    async function checkIfauthenticated() {
      try {
        await getAuthUser();
      } catch (error) {
        toast.error("UNAUTHORIZED");
      }
    }
    void checkIfauthenticated();
    const data: data = readFromStorage("user");
    if (!data.verified) {
      void router.replace("/sign-up/verify-email");
      return;
    }
  }, [router, getDataFn]);

  useEffect(() => {
    getDataFn({ page: page });
  }, [page, getDataFn]);

  const nextPage = () => {
    if (!loading) {
      let newPage = page + 1;
      if (newPage > numOfPages) {
        newPage = 1;
      }
      setPage(newPage);
    }
  };
  const prevPage = () => {
    if (!loading) {
      let newPage = page - 1;
      if (newPage < 1) {
        newPage = numOfPages;
      }
      setPage(newPage);
    }
  };

  const createPageBtn = (pageNumber: number) => {
    return (
      <button
        type="button"
        key={pageNumber}
        className={`mx-3 hover:text-gray-700 disabled:cursor-wait disabled:text-gray-300 ${pageNumber == page ? "text-black" : ""}`}
        onClick={() => setPage(pageNumber)}
        disabled={loading}
      >
        {pageNumber}
      </button>
    );
  };

  const renderPageButtons = () => {
    const pageButtons: React.JSX.Element[] = [];
    const windowSize = 4; // how many buttons to show on each side of the current button
    if (windowSize >= numOfPages) {
      for (let i = 1; i <= numOfPages; i++) {
        pageButtons.push(createPageBtn(i));
      }
    } else {
      if (page > Math.ceil(windowSize / 2) + 1) {
        pageButtons.push(<span key={"dot-1"}>...</span>);
      }
      let start = page;
      if (page <= Math.floor(windowSize / 2)) {
        start = 1;
      } else if (page - Math.floor(windowSize / 2) > 0) {
        start = page - Math.floor(windowSize / 2);
      }
      if (page + windowSize >= numOfPages) {
        start = numOfPages - windowSize;
      }
      for (let i = start; i <= start + windowSize; i++) {
        if (i < 1 || i > numOfPages) continue;
        pageButtons.push(createPageBtn(i));
      }
      if (page + windowSize < numOfPages) {
        pageButtons.push(<span key={"dot-2"}>...</span>);
      }
    }

    return pageButtons;
  };

  // if (loading) {
  //   return (
  //     <main className="grid  h-[calc(100vh-10rem)] place-items-center">
  //       <Loading />
  //     </main>
  //   );
  // }

  return (
    <main className="grid  place-items-center">
      <form className="m-5 flex  flex-col rounded-xl border p-4 sm:min-w-[35%] sm:p-12">
        <h2 className="mb-5 text-center text-2xl font-bold">
          Please mark your interests!
        </h2>
        <p className="mb-5 text-center ">We will keep you notified.</p>
        <h3 className="mb-5 font-semibold">My saved interests!</h3>
        <div className="mb-7">
          {loading ? (
            <Loading />
          ) : (
            categories?.map((props) => {
              return <CheckboxInput {...props} key={props.id} />;
            })
          )}
        </div>
        <div className="flex  items-center gap-0.5  text-gray-400">
          <HiChevronDoubleLeft
            onClick={() => {
              if (!loading) {
                setPage(1);
              }
            }}
            className="hover:cursor-pointer hover:text-gray-700"
          />
          <HiChevronLeft
            onClick={prevPage}
            className="hover:cursor-pointer hover:text-gray-700"
          />
          {renderPageButtons()}
          <HiChevronRight
            onClick={nextPage}
            className="hover:cursor-pointer hover:text-gray-700"
          />
          <HiChevronDoubleRight
            onClick={() => {
              if (!loading) {
                setPage(numOfPages);
              }
            }}
            className="hover:cursor-pointer hover:text-gray-700"
          />
        </div>
      </form>
    </main>
  );
}
