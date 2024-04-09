import { PiCheckBold } from "react-icons/pi";
import type { Categories } from "../page";
import { api } from "~/trpc/react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CheckboxInput({ name, id, isChecked }: Categories) {
  const [checked, setChecked] = useState(isChecked);
  const [submitting, setSubmitting] = useState(false);
  const { mutate: updateCategoryFn } =
    api.categories.updateCategory.useMutation({
      onMutate() {
        setSubmitting(true);
      },
      onSettled() {
        setSubmitting(false);
      },
      onError(error) {
        toast.error(error.message);
      },
      onSuccess(data) {
        if (data.success === false) return;
        setChecked(data.category.isChecked);
      },
    });

  const handleChange = () => {
    updateCategoryFn({ catagoryId: id, isChecked: !checked });
    setChecked((prev) => !prev);
  };
  return (
    <div className="mb-3 flex  items-center gap-3 ">
      <input
        type="checkbox"
        name={name}
        id={id}
        className="peer
  relative h-5 w-5 shrink-0 appearance-none rounded-sm
   bg-gray-300 
  checked:border-0 checked:bg-black hover:cursor-pointer hover:text-gray-500
  focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-0 disabled:bg-gray-500"
        checked={checked}
        onChange={() => handleChange()}
        disabled={submitting}
      />
      <PiCheckBold className="pointer-events-none absolute h-5 w-5 fill-none stroke-white px-[1px]  hover:text-gray-500 peer-checked:!fill-white " />
      <label
        htmlFor={id}
        className="capitalize hover:cursor-pointer hover:text-gray-500 peer-disabled:cursor-not-allowed peer-disabled:text-gray-500"
      >
        {name}
      </label>
    </div>
  );
}
