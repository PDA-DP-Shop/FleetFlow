/**
 * FleetFlow Logic (Wireframe/Local Data Version)
 */

const app = {
    data: {
        vehicles: [],
        drivers: [],
        trips: [],
        maintenanceLogs: []
    },

    init: function() {
        this.loadData();
        this.cacheDOM();
        this.bindEvents();
        this.renderAll();
    },

    cacheDOM: function() {
        this.authPage = document.getElementById('auth-page');
        this.mainLayout = document.getElementById('main-layout');
        this.pages = document.querySelectorAll('.content-section');
        this.navItems = document.querySelectorAll('.nav-item');
    },

    bindEvents: function() {
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.authPage.classList.remove('active');
            this.mainLayout.classList.add('active');
        });
        
        document.getElementById('logout-btn').addEventListener('click', () => {
             this.mainLayout.classList.remove('active');
             this.authPage.classList.add('active');
        });

        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const target = item.getAttribute('data-target');
                this.showPage(target);
            });
        });

        document.getElementById('create-trip-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createTrip();
        });

        document.getElementById('form-add-vehicle').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addVehicle();
        });
        
        document.getElementById('form-log-service').addEventListener('submit', (e) => {
             e.preventDefault();
             this.logService();
        });
        
        document.getElementById('form-add-expense').addEventListener('submit', (e) => {
             e.preventDefault();
             this.closeModal('add-expense-modal'); // dummy close for now
        });
    },

    loadData: function() {
        const _data = localStorage.getItem('fleetFlow_wf_data');
        if (_data) {
            this.data = JSON.parse(_data);
        } else {
            this.data = {
                vehicles: [
                    { id: 'V1', name: 'Ford Transit', plate: 'WF-101', capacity: 1500, odo: 45000, status: 'Active', fuel: 500, maint: 200, rev: 3000 },
                    { id: 'V2', name: 'Volvo Truck', plate: 'WF-202', capacity: 5000, odo: 120000, status: 'Maintenance', fuel: 1500, maint: 800, rev: 8000 }
                ],
                drivers: [
                    { id: 'D1', name: 'John Doe', exp: '2026-05-01', trips: 140, score: 98, status: 'Active' },
                    { id: 'D2', name: 'Jane Smith', exp: '2022-01-01', trips: 55, score: 80, status: 'Suspended (License)' }
                ],
                trips: [
                    { id: 'TRP-555', vId: 'V1', dId:'D1', status: 'In Progress', cargo: 500 },
                    { id: 'TRP-556', vId: 'V1', dId:'D1', status: 'Completed', cargo: 1200, fuel: 50, cost: 80 }
                ],
                maintenanceLogs: [
                    { id: 'LOG-01', vId: 'V2', desc: 'Engine Check', date: '2023-10-25' }
                ]
            };
            this.saveData();
        }
    },

    saveData: function() {
        localStorage.setItem('fleetFlow_wf_data', JSON.stringify(this.data));
        this.renderAll();
    },

    showPage: function(pageId) {
        this.pages.forEach(p => p.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
        
        this.navItems.forEach(n => n.classList.remove('active'));
        const activeNav = document.querySelector(`[data-target="${pageId}"]`);
        if(activeNav) activeNav.classList.add('active');
        
        this.renderAll();
    },
    
    openModal: function(id) {
         document.getElementById(id).classList.remove('hidden');
    },
    closeModal: function(id) {
         document.getElementById(id).classList.add('hidden');
    },

    renderAll: function() {
        this.renderDash();
        this.renderVehicles();
        this.renderDispatch();
        this.renderMaintenance();
        this.renderFinance();
        this.renderDrivers();
        this.renderAnalytics();
    },

    renderDash: function() {
        const active = this.data.vehicles.filter(v => v.status === 'Active').length;
        const maint = this.data.vehicles.filter(v => v.status === 'Maintenance').length;
        
        document.getElementById('kpi-active').innerText = active;
        document.getElementById('kpi-alerts').innerText = maint;
        document.getElementById('kpi-pending').innerText = '1';

        const tbody = document.getElementById('recent-trips-tbody');
        tbody.innerHTML = this.data.trips.map(t => {
            const v = this.data.vehicles.find(v => v.id === t.vId);
            return `<tr>
                <td>${t.id}</td>
                <td>${v ? v.name : '-'}</td>
                <td class="${t.status === 'Completed' ? 'green-text' : ''}">${t.status}</td>
                <td>--</td>
            </tr>`;
        }).join('');
    },

    renderVehicles: function() {
        const tbody = document.getElementById('vehicles-tbody');
        tbody.innerHTML = this.data.vehicles.map(v => `
            <tr>
                <td>${v.plate}</td>
                <td>${v.name}</td>
                <td>${v.capacity} kg</td>
                <td>${v.odo}</td>
                <td class="${v.status === 'Active' ? 'green-text' : 'red-text'}">${v.status}</td>
                <td><button class="wireframe-btn">Edit</button></td>
            </tr>
        `).join('');
    },
    
    renderDispatch: function() {
        const vSel = document.getElementById('dispatch-vehicle');
        const dSel = document.getElementById('dispatch-driver');
        
        vSel.innerHTML = '<option value="">-- Select --</option>' + this.data.vehicles.filter(v=>v.status==='Active').map(v=>`<option value="${v.id}">${v.name} (${v.capacity}kg)</option>`).join('');
        dSel.innerHTML = '<option value="">-- Select --</option>' + this.data.drivers.filter(d=>d.status==='Active').map(d=>`<option value="${d.id}">${d.name}</option>`).join('');
        
        const tbody = document.getElementById('trip-pipeline-tbody');
        tbody.innerHTML = this.data.trips.map(t => {
            const v = this.data.vehicles.find(v => v.id === t.vId);
            const d = this.data.drivers.find(d => d.id === t.dId);
            return `<tr>
                <td>${t.id}</td>
                <td>${v ? v.name : '-'}</td>
                <td>${d ? d.name : '-'}</td>
                <td>${t.status}</td>
            </tr>`;
        }).join('');
    },
    
    renderMaintenance: function() {
         const mSel = document.getElementById('maint-vehicle');
         mSel.innerHTML = '<option value="">-- Select --</option>' + this.data.vehicles.map(v=>`<option value="${v.id}">${v.name}</option>`).join('');
         
         const tbody = document.getElementById('service-logs-tbody');
         tbody.innerHTML = this.data.maintenanceLogs.map(m => {
            const v = this.data.vehicles.find(v => v.id === m.vId);
            return `<tr>
                <td>${m.id}</td>
                <td>${v ? v.name : '-'}</td>
                <td>${m.desc}</td>
                <td>${m.date}</td>
                <td><button class="wireframe-btn">Complete</button></td>
            </tr>`;
        }).join('');
    },
    
    renderFinance: function() {
        const tbody = document.getElementById('finance-tbody');
        const completed = this.data.trips.filter(t => t.status === 'Completed');
        tbody.innerHTML = completed.map(t => {
            const v = this.data.vehicles.find(v => v.id === t.vId);
            return `<tr>
                <td>${t.id}</td>
                <td>${v ? v.name : '-'}</td>
                <td>${v ? v.odo + 200 : '-'}</td>
                <td>${t.fuel || 0} L / $${t.cost || 0}</td>
            </tr>`;
        }).join('');
    },
    
    renderDrivers: function() {
        const tbody = document.getElementById('driver-tbody');
        tbody.innerHTML = this.data.drivers.map(d => {
             const isExp = new Date(d.exp) < new Date();
             return `<tr>
                <td>${d.name}</td>
                <td class="${isExp ? 'red-text' : ''}">${d.exp}</td>
                <td>${d.trips}</td>
                <td>${d.score}%</td>
                <td>${isExp ? 'Expired' : 'Valid'}</td>
                <td class="${d.status.includes('Suspended') ? 'red-text' : 'green-text'}">${d.status}</td>
            </tr>`;
        }).join('');
    },
    
    renderAnalytics: function() {
         document.getElementById('metric-total-trips').innerText = this.data.trips.length;
         
         // Mock charts if Chart.js is loaded
         if(window.Chart && document.getElementById('efficiencyChart')) {
              // Destroy old ones if exist
              const canvas1 = document.getElementById('efficiencyChart');
              const canvas2 = document.getElementById('costRevChart');
              Chart.getChart(canvas1)?.destroy();
              Chart.getChart(canvas2)?.destroy();
              
              const ctx1 = canvas1.getContext('2d');
              new Chart(ctx1, {
                  type: 'line',
                  data: {
                      labels: ['W1', 'W2', 'W3', 'W4'],
                      datasets: [{
                          label: 'Efficiency',
                          data: [80, 85, 82, 94],
                          borderColor: '#2ed573',
                          tension: 0.1
                      }]
                  },
                  options: { responsive: true, maintainAspectRatio: false }
              });
              
              const ctx2 = canvas2.getContext('2d');
              new Chart(ctx2, {
                  type: 'bar',
                  data: {
                      labels: ['Vehicle 1', 'Vehicle 2'],
                      datasets: [{
                          label: 'Revenue',
                          data: [3000, 8000],
                          backgroundColor: '#2ed573'
                      }, {
                          label: 'Cost',
                          data: [700, 2300],
                          backgroundColor: '#ff4757'
                      }]
                  },
                  options: { responsive: true, maintainAspectRatio: false }
              });
         }
    },

    // Actions
    createTrip: function() {
        const vId = document.getElementById('dispatch-vehicle').value;
        const dId = document.getElementById('dispatch-driver').value;
        const cargo = parseFloat(document.getElementById('dispatch-cargo').value);
        const errEl = document.getElementById('dispatch-error');
        errEl.classList.add('hidden');

        const v = this.data.vehicles.find(v => v.id === vId);
        
        if (cargo > v.capacity) {
            errEl.innerText = `Error: Cargo (${cargo}kg) exceeds vehicle capacity (${v.capacity}kg).`;
            errEl.classList.remove('hidden');
            return;
        }

        this.data.trips.push({
            id: 'TRP-' + Math.floor(Math.random()*900+100),
            vId, dId, status: 'Dispatched', cargo
        });

        this.saveData();
        document.getElementById('create-trip-form').reset();
    },
    
    addVehicle: function() {
         const plate = document.getElementById('v-plate').value;
         const cap = document.getElementById('v-cap').value;
         const mod = document.getElementById('v-model').value;
         
         this.data.vehicles.push({
              id: 'V' + Date.now(),
              name: mod, plate: plate, capacity: cap, odo: 0, status: 'Active', fuel: 0, maint: 0, rev: 0
         });
         this.saveData();
         this.closeModal('add-vehicle-modal');
         document.getElementById('form-add-vehicle').reset();
    },
    
    logService: function() {
         const vId = document.getElementById('maint-vehicle').value;
         const desc = document.getElementById('maint-desc').value;
         
         const v = this.data.vehicles.find(v => v.id === vId);
         if(v) v.status = 'Maintenance';
         
         this.data.maintenanceLogs.push({id: 'LOG-'+Date.now(), vId, desc, date: new Date().toISOString().split('T')[0]});
         this.saveData();
         this.closeModal('log-service-modal');
         document.getElementById('form-log-service').reset();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
