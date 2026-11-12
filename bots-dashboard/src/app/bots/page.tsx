import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard/dashboard";

export const metadata: Metadata = {
  title: "Floor",
};

const BotsPage = () => <Dashboard />;

export default BotsPage;
