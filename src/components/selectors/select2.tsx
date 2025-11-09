import { useState, useRef, useEffect } from "react";

interface Option {
  value: unknown;
  label: string;
}

interface Props {
  label?: string;
  options: Option[];
  value: unknown;
  onChange: (value: unknown) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function SearchSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Buscar...",
  disabled
}: Props) {

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // ✅ Cerrar cuando se hace clic afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Filtrar
  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabel = options.find((o) => o.value === value)?.label || "";

  return (
    <div style={{ marginTop: 10 }} ref={wrapperRef}>
      {label && (
        <label style={{ display: "block", marginBottom: 5 }}>{label}</label>
      )}

      {/* SELECT SIMULADO */}
      <div
        onClick={() => !disabled && setOpen(!open)}
        style={{
          border: "1px solid #ccc",
          padding: "8px",
          borderRadius: "4px",
          backgroundColor: disabled ? "#eee" : "white",
          cursor: disabled ? "not-allowed" : "pointer"
        }}
      >
        {selectedLabel || <span style={{ color: "#999" }}>{placeholder}</span>}
      </div>

      {/* DESPLEGABLE */}
      {open && (
        <div
          style={{
            border: "1px solid #ccc",
            background: "white",
            marginTop: 4,
            borderRadius: 4,
            maxHeight: 200,
            overflowY: "auto",
            position: "absolute",
            width: "95%",
            zIndex: 99999,
            boxShadow: "0px 2px 6px rgba(0,0,0,0.15)"
          }}
        >
          <input
            autoFocus
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            style={{
              width: "92%",
              padding: "6px",
              margin: "6px",
              border: "1px solid #ddd",
              borderRadius: "4px"
            }}
          />

          {filtered.length === 0 && (
            <p style={{ padding: 10, color: "#777", fontSize: 14 }}>
              No hay coincidencias
            </p>
          )}

          {filtered.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setSearch("");
                setOpen(false);
              }}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                borderBottom: "1px solid #f3f3f3",
                backgroundColor:
                  value === opt.value ? "rgba(0, 123, 255, 0.1)" : "white"
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}