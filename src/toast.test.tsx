import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useToast, ToastContainer } from './toast';

describe('Toast', () => {
  it('should render toast with message', () => {
    const TestComponent = () => {
      const { toasts, addToast, removeToast } = useToast();
      return (
        <div>
          <button onClick={() => addToast('Test message', 'success')}>Add Toast</button>
          <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
      );
    };

    render(<TestComponent />);
    
    fireEvent.click(screen.getByText('Add Toast'));
    
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should remove toast when close button is clicked', () => {
    const TestComponent = () => {
      const { toasts, addToast, removeToast } = useToast();
      return (
        <div>
          <button onClick={() => addToast('Test message', 'error')}>Add Toast</button>
          <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
      );
    };

    render(<TestComponent />);
    
    fireEvent.click(screen.getByText('Add Toast'));
    expect(screen.getByText('Test message')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('×'));
    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  it('should render different toast types', () => {
    const TestComponent = () => {
      const { toasts, addToast, removeToast } = useToast();
      return (
        <div>
          <button onClick={() => addToast('Success', 'success')}>Success</button>
          <button onClick={() => addToast('Error', 'error')}>Error</button>
          <button onClick={() => addToast('Warning', 'warning')}>Warning</button>
          <button onClick={() => addToast('Info', 'info')}>Info</button>
          <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
      );
    };

    render(<TestComponent />);
    
    fireEvent.click(screen.getByText('Success'));
    fireEvent.click(screen.getByText('Error'));
    fireEvent.click(screen.getByText('Warning'));
    fireEvent.click(screen.getByText('Info'));
    
    expect(screen.getAllByText('Success').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Error').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Warning').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Info').length).toBeGreaterThan(0);
  });
});
