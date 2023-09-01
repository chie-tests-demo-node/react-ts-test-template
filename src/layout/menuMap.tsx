import Home from "../pages/Home";
import { useEffect } from "react";
import { useRouteBreak } from "../auth";


export interface LayoutContentMapType {
  [key: string]: React.ReactNode;
}
export const LayoutContentMap: LayoutContentMapType = {
  "/home": <Home />,
};


export const UnknowBreakJSX: any = () => {
  const routeBreak = useRouteBreak()
  useEffect(() => {
    routeBreak("/home")
  }, [routeBreak])
  return <>345</>
}


