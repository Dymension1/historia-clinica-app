import type { CSSProperties } from 'react';

// Estilos del tema oscuro compartidos por los componentes del formulario
// (usados como inline styles para mantenerse encapsulados)

export const SECTION_TITLE: CSSProperties = {
    background: 'rgba(0,170,228,0.15)',
    borderLeft: '3px solid #00aae4',
    color: '#00aae4',
    fontWeight: '700',
    fontSize: '11px',
    letterSpacing: '1.2px',
    padding: '8px 14px',
    textTransform: 'uppercase',
    fontFamily: "'Inter', Arial, sans-serif",
};

export const SECTION_BODY: CSSProperties = {
    border: '1px solid rgba(255,255,255,0.08)',
    borderTop: 'none',
    backgroundColor: 'rgba(255,255,255,0.03)',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.85)',
    fontFamily: "'Inter', Arial, sans-serif",
};

export const SECTION_COL: CSSProperties = {
    borderRight: '1px solid rgba(255,255,255,0.08)',
};
