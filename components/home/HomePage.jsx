// import useFov from "@/hooks/useFov";
// import usePlace from "@/hooks/usePlace";
// import { places } from "@/lib/constants";

const HomePage = () => {
  // const updateActiveIndex = usePlace(state => state.updateActiveIndex);
  // const fov = useFov(state => state.fov);
  // const updateFov = useFov(state => state.updateFov);

  return (
    <div className="w-fit h-fit fixed top-0 left-0 flex items-start justify-start z-10">
      <h1 className="text-6xl">
        Radiant Particles
      </h1>
    </div>
  )
}

export default HomePage