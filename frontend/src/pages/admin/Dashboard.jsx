import React, { useEffect, useState } from "react";
import icons from "../../components/admin/AddProduct/SidebarIcons";
import ConfirmDeleteModal from "../../components/admin/dashboard/ConfirmDeleteModal";
import "./Dashboard.css";
import axios from "axios";

const sidebarItems = [
  { key: "dashboard", label: "Dashboard", icon: icons.dashboard, link: "/dashboard" },
  { key: "add", label: "Add Product", icon: icons.add, link: "/dashboard/add" },
  { key: "import", label: "Import", icon: icons.import, link: "/dashboard/import" },
  { key: "profile", label: "Profile", icon: icons.profile, link: "/dashboard/profile" },
  { key: "data", label: "Data", icon: icons.data, link: "/dashboard/data" },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // Fetch products on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/vehicles/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
        });
        setProducts(res.data);
      } catch (e) {
        setProducts([]); // Fail gracefully
      }
    };
    fetchData();
  }, []);

  // Collapse sidebar on small screens
  useEffect(() => {
    const resize = () => setSidebarOpen(window.innerWidth > 800);
    window.addEventListener("resize", resize);
    resize();
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Handle delete
  const handleDelete = async () => {
    await axios.delete(`http://127.0.0.1:8000/api/vehicles/${selected.id}/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
    });
    setProducts(products.filter(p => p.id !== selected.id));
    setModalOpen(false);
    setSelected(null);
  };

  // Logout logic
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="admin-root">
      {/* Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? "" : "collapsed"}`}>
          <div className="sidebar-menu">
            {/* Hamburger as sidebar icon */}
            <button
              className="sidebar-item"
              style={{ border: "none", background: "none", cursor: "pointer", outline: "none" }}
              onClick={() => setSidebarOpen(v => !v)}
              aria-label="Toggle Sidebar"
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <span className="sidebar-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" stroke="#232323" fill="none" strokeWidth="2">
                  <rect x="4" y="6" width="16" height="2" rx="1"/>
                  <rect x="4" y="11" width="16" height="2" rx="1"/>
                  <rect x="4" y="16" width="16" height="2" rx="1"/>
                </svg>
              </span>
              {sidebarOpen && <span className="sidebar-label">Collapse</span>}
            </button>
            {sidebarItems.map(item => (
              <a key={item.key} href={item.link} className="sidebar-item" title={item.label}>
                <span className="sidebar-icon">{item.icon}</span>
                {sidebarOpen && <span className="sidebar-label">{item.label}</span>}
              </a>
            ))}
          </div>
        </aside>


      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-title">SANCHARI</div>
          <div
            className="admin-logout"
            tabIndex={0}
            onClick={handleLogout}
            onMouseEnter={e => e.currentTarget.classList.add("expand")}
            onMouseLeave={e => e.currentTarget.classList.remove("expand")}
          >
            {icons.logout}
            <span className="admin-logout-label">Log out</span>
          </div>
        </div>

        {/* Product Card Grid */}
        <div className="card-grid">
          {products.length === 0 ? (
            <div className="no-products">
              <span style={{ color: "#bdbdbd", fontSize: 24, margin: "0 auto", padding: "64px 0" }}>
                No products yet.
              </span>
            </div>
          ) : (
                products.map(product => (
                  <div
                    className="product-card"
                    key={product.id}
                    onClick={() => window.location.href = `/dashboard/vehicle/${product.id}/preview`}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      className="product-img"
                      src={product.image || "/placeholder.jpg"}
                      alt={product.name}
                    />
                    <div className="product-body">
                      <div className="product-title">{product.name}</div>
                      <div className="product-info">
                        <span className="product-info-item" title="Daily Price">{icons.price} ₹{product.price_daily}</span>
                        <span className="product-info-item" title={product.available ? "Available" : "Not available"}>
                          {product.available ? icons.available : icons.unavailable}
                          {product.available ? "Available" : "Unavailable"}
                        </span>
                      </div>
                    </div>

                    {/* Prevent click from triggering preview when clicking edit/delete */}
                    <div
                      className="product-actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <a
                        href={`/dashboard/edit/${product.id}`}
                        className="action-btn"
                        title="Edit"
                      >
                        {icons.edit}
                      </a>
                      <button
                        className="action-btn"
                        title="Delete"
                        onClick={() => {
                          setSelected(product);
                          setModalOpen(true);
                        }}
                      >
                        {icons.delete}
                      </button>
                    </div>
                  </div>
                ))
          )}
        </div>
      </main>

      {/* Delete Modal */}
      <ConfirmDeleteModal
        open={modalOpen}
        product={selected}
        onConfirm={handleDelete}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}
