import TopNavBar from "@/components/TopNavBar";

export default function DashBoardLayout({ children }: LayoutProps<"/">) {
  return (
    <div>
      <TopNavBar />
      {children}
    </div>
  );
}
