export default function DashboardPage() {
  return (
    <div>

      <h1 className="text-3xl font-bold">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-6 mt-8">

        <div className="bg-white p-6 rounded shadow">
          Total Users
        </div>

        <div className="bg-white p-6 rounded shadow">
          Total Tournaments
        </div>

        <div className="bg-white p-6 rounded shadow">
          Total Matches
        </div>

        <div className="bg-white p-6 rounded shadow">
          Revenue
        </div>

      </div>

    </div>
  );
}