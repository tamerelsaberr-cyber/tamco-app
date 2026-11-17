"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [priceAfter, setPriceAfter] = useState("");
  const [category, setCategory] = useState("");
  const [specs, setSpecs] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("tamco-products");
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tamco-products", JSON.stringify(products));
  }, [products]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImg = (i: number) => {
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleAdd = () => {
    if (!name || !price) {
      alert("Please enter product name and price.");
      return;
    }

    const newProduct = {
      id: Date.now(),
      name,
      price,
      priceAfter,
      category,
      specs,
      image: imagePreviews,
    };

    if (editIndex !== null) {
      const updated = [...products];
      updated[editIndex] = newProduct;
      setProducts(updated);
      setEditIndex(null);
    } else {
      setProducts([...products, newProduct]);
    }

    setName("");
    setPrice("");
    setPriceAfter("");
    setCategory("");
    setSpecs("");
    setImagePreviews([]);
  };

  const handleEdit = (i: number) => {
    const p = products[i];
    setName(p.name || "");
    setPrice(p.price || "");
    setPriceAfter(p.priceAfter || "");
    setCategory(p.category || "");
    setSpecs(p.specs || "");
    setImagePreviews(p.image || p.images || []);
    setEditIndex(i);
  };

  const handleDelete = (i: number) => {
    setProducts(products.filter((_, idx) => idx !== i));
  };

  const inp = { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d5c7be", marginBottom: "10px" };

  return (
    <div style={{ backgroundColor: "#fcfaf8", minHeight: "100vh", padding: "24px 16px", fontFamily: "sans-serif", color: "#2d241e" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", backgroundColor: "#ffffff", padding: "24px", borderRadius: "14px", border: "1px solid #eadfd8" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h1 style={{ margin: 0, fontSize: "20px", color: "#5c3d2e" }}>
            TAMCO Admin Panel ({products.length})
          </h1>
          <Link href="/" style={{ backgroundColor: "#065439", color: "#fff", padding: "8px 14px", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: "bold" }}>
            Back to Store
          </Link>
        </div>

        <div>
          <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} style={inp} />
          <input type="text" placeholder="Price (e.g., 45.00 Pi)" value={price} onChange={(e) => setPrice(e.target.value)} style={inp} />
          <input type="text" placeholder="Discounted Price (Optional)" value={priceAfter} onChange={(e) => setPriceAfter(e.target.value)} style={inp} />
          <input type="text" placeholder="Category (e.g., Bedroom, Salon)" value={category} onChange={(e) => setCategory(e.target.value)} style={inp} />
          <textarea placeholder="Wood & Dimensions Specifications" value={specs} onChange={(e) => setSpecs(e.target.value)} style={{ ...inp, minHeight: "80px" }} />
          <input type="file" multiple onChange={handleImage} accept="image/*" style={{ marginBottom: "14px" }} />

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
            {imagePreviews.map((img, i) => (
              <div key={i} style={{ position: "relative" }}>
                <img src={img} alt="preview" width={80} height={80} style={{ borderRadius: "8px", objectFit: "cover" }} />
                <button onClick={() => removeImg(i)} style={{ position: "absolute", top: 0, right: 0, backgroundColor: "#b91c1c", color: "#fff", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer" }}>
                  X
                </button>
              </div>
            ))}
          </div>

          <button onClick={handleAdd} style={{ width: "100%", backgroundColor: "#5c3d2e", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
            {editIndex !== null ? "Save Product Changes" : "Publish Product"}
          </button>
        </div>

        <div style={{ marginTop: "28px", display: "grid", gap: "10px" }}>
          {products.map((p, i) => (
            <div key={p.id || i} style={{ border: "1px solid #eadfd8", padding: "12px", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>{p.name}</strong> - <span style={{ color: "#065439", fontWeight: "bold" }}>{p.price}</span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => handleEdit(i)} style={{ backgroundColor: "#065439", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(i)} style={{ backgroundColor: "#b91c1c", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}