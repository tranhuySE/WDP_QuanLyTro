const StaffLayout = () => {
  return (
    <div className="staff-layout">
      <header className="staff-header">
        <h1>Staff Dashboard</h1>
      </header>
      <nav className="staff-nav">
        <ul>
          <li><a href="/staff/dashboard">Dashboard</a></li>
          <li><a href="/staff/reports">Reports</a></li>
          <li><a href="/staff/settings">Settings</a></li>
        </ul>
      </nav>

    </div>
  );
}
export default StaffLayout;