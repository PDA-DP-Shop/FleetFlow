/**
 * FleetFlow Core Application Logic
 * Powered by Vanilla JS & LocalStorage (Mocking Real-time DB)
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
        this.appContainer = document.getElementById('app-container');
        this.authPage = document.getElementById('auth-page');
        this.mainLayout = document.getElementById('main-layout');
        this.pages = document.querySelectorAll('.content-section');
        this.navItems = document.querySelectorAll('.nav-item');
        this.pageTitle = document.getElementById('page-title');
    },

    bindEvents: function() {
        // Auth
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });
        
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });

        // Navigation
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const target = item.getAttribute('data-target');
                this.showPage(target);
            });
        });

        // Forms
        document.getElementById('create-trip-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createTrip();
        });

        document.getElementById('maintenance-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.logMaintenance();
        });

        // Mobile Menu
        document.querySelector('.mobile-menu-toggle').addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('open');
        });
    },

    // --- Mock Database (LocalStorage) ---
    loadData: function() {
        const _data = localStorage.getItem('fleetFlow_data');
        if (_data) {
            this.data = JSON.parse(_data);
        } else {
            // Seed Initial Data (Problem Statement Scenario)
            this.data = {
                vehicles: [
                    { id: 'V001', name: 'Van-05', plate: 'FLT-001', capacity: 500, odo: 12500, status: 'available', maintenance: 450, fuel: 800, rev: 3500 },
                    { id: 'V002', name: 'Truck-Heavy', plate: 'FLT-002', capacity: 3000, odo: 84000, status: 'on_trip', maintenance: 1200, fuel: 3400, rev: 9200 },
                    { id: 'V003', name: 'City Bike', plate: 'FLT-003', capacity: 30, odo: 1200, status: 'in_shop', maintenance: 50, fuel: 10, rev: 400 }
                ],
                drivers: [
                    { id: 'D001', name: 'Alex Johnson', licenseExp: '2027-12-01', status: 'available', trips: 45, score: 98, img: 'https://ui-avatars.com/api/?name=Alex+Johnson' },
                    { id: 'D002', name: 'Sarah Connor', licenseExp: '2023-05-15', status: 'available', trips: 112, score: 85, img: 'https://ui-avatars.com/api/?name=Sarah+Connor' }, // Expired license example
                    { id: 'D003', name: 'Mike Ross', licenseExp: '2026-08-20', status: 'on_duty', trips: 89, score: 100, img: 'https://ui-avatars.com/api/?name=Mike+Ross' }
                ],
                trips: [
                    { id: 'TRP-101', vId: 'V002', dId: 'D003', cargo: 2100, dest: 'Warehouse B', status: 'dispatched', cost: 0, rev: 450, date: new Date().toISOString() },
                    { id: 'TRP-100', vId: 'V001', dId: 'D001', cargo: 300, dest: 'Client Site A', status: 'completed', cost: 45.5, rev: 250, date: new Date(Date.now() - 86400000).toISOString() }
                ],
                maintenanceLogs: [
                    { id: 'M001', vId: 'V003', desc: 'Broken chain replacement', date: new Date().toISOString() }
                ]
            };
            this.saveData();
        }
    },

    saveData: function() {
        localStorage.setItem('fleetFlow_data', JSON.stringify(this.data));
        this.renderAll(); // Re-render UI on data change (simulating real-time reactivity)
    },

    // --- Authentication ---
    login: function() {
        Swal.fire({ title: 'Authenticating', timer: 800, timerProgressBar: true, showConfirmButton: false }).then(() => {
            this.authPage.classList.remove('active');
            this.mainLayout.classList.remove('hidden');
            this.mainLayout.classList.add('active');
        });
    },

    logout: function() {
        this.mainLayout.classList.add('hidden');
        this.mainLayout.classList.remove('active');
        this.authPage.classList.add('active');
    },

    // --- Routing ---
    showPage: function(pageId) {
        // Toggle view
        this.pages.forEach(p => p.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
        
        // Toggle nav
        this.navItems.forEach(n => n.classList.remove('active'));
        const activeNav = document.querySelector(`[data-target="${pageId}"]`);
        if(activeNav) {
            activeNav.classList.add('active');
            this.pageTitle.innerText = activeNav.querySelector('span').innerText;
        }
        
        // Close sidebar on mobile
        document.querySelector('.sidebar').classList.remove('open');
        this.renderAll();
    },

    // --- Core Logic & Rendering ---
    renderAll: function() {
        this.renderDash();
        this.renderVehicles();
        this.renderDispatchLists();
        this.renderFinance();
        this.renderDrivers();
        this.renderMaintenance();
    },

    // Utility: Status Badges
    getBadge: function(status) {
        const map = {
            'available': '<span class="status-badge bg-success">Available</span>',
            'on_trip': '<span class="status-badge bg-warning">On Trip</span>',
            'on_duty': '<span class="status-badge bg-warning">On Duty</span>',
            'in_shop': '<span class="status-badge bg-danger">In Shop</span>',
            'dispatched': '<span class="status-badge bg-primary">Dispatched</span>',
            'completed': '<span class="status-badge bg-success">Completed</span>'
        };
        return map[status] || `<span class="status-badge bg-primary">${status}</span>`;
    },

    renderDash: function() {
        // KPIs
        const onTrip = this.data.vehicles.filter(v => v.status === 'on_trip').length;
        const inShop = this.data.vehicles.filter(v => v.status === 'in_shop').length;
        const totalV = this.data.vehicles.length;
        const util = totalV > 0 ? Math.round((onTrip / totalV) * 100) : 0;
        
        document.getElementById('kpi-active').innerText = onTrip;
        document.getElementById('kpi-alerts').innerText = inShop;
        document.getElementById('kpi-utilization').innerText = util + '%';
        document.getElementById('kpi-pending').innerText = '0'; // placeholder logic

        // Recent Trips Table
        const tbody = document.getElementById('recent-trips-tbody');
        tbody.innerHTML = '';
        this.data.trips.slice(0).reverse().forEach(t => {
            const v = this.data.vehicles.find(v => v.id === t.vId);
            const d = this.data.drivers.find(d => d.id === t.dId);
            tbody.innerHTML += `
                <tr>
                    <td><strong>${t.id}</strong></td>
                    <td>${v ? v.name : 'Unknown'}</td>
                    <td>${d ? d.name : 'Unknown'}</td>
                    <td>${this.getBadge(t.status)}</td>
                    <td>${t.cargo} kg</td>
                </tr>
            `;
        });
    },

    renderVehicles: function() {
        const tbody = document.getElementById('vehicles-tbody');
        tbody.innerHTML = '';
        this.data.vehicles.forEach(v => {
            tbody.innerHTML += `
                <tr>
                    <td><strong>${v.name}</strong></td>
                    <td>${v.plate}</td>
                    <td>${v.capacity} kg</td>
                    <td>${v.odo} km</td>
                    <td>${this.getBadge(v.status)}</td>
                    <td><button class="btn-text" onclick="app.retireVehicle('${v.id}')">Retire</button></td>
                </tr>
            `;
        });

        // ROI Table
        const roiBody = document.getElementById('analytics-roi');
        if(roiBody) {
            roiBody.innerHTML = '';
            let effScore = 0;
            this.data.vehicles.forEach(v => {
                const ops = v.maintenance + v.fuel;
                const roi = ops > 0 ? (((v.rev - ops) / ops) * 100).toFixed(1) : 0;
                effScore += parseFloat(roi > 100 ? 100 : (roi > 0 ? roi : 0));
                
                roiBody.innerHTML += `
                    <tr><td>${v.name}</td><td class="text-gradient-green">$${v.rev}</td><td class="text-warning">$${ops}</td><td>${roi}%</td></tr>
                `;
            });
            const finalEff = this.data.vehicles.length > 0 ? Math.round(effScore / this.data.vehicles.length) : 0;
            const efEl = document.getElementById('efficiency-score');
            if(efEl) efEl.innerText = finalEff + '%';
        }
    },

    renderDispatchLists: function() {
        // Dropdowns
        const vSelect = document.getElementById('dispatch-vehicle');
        const dSelect = document.getElementById('dispatch-driver');
        
        // Find available options
        const availV = this.data.vehicles.filter(v => v.status === 'available');
        const availD = this.data.drivers.filter(d => d.status === 'available');

        vSelect.innerHTML = '<option value="">-- Choose Vehicle --</option>' + availV.map(v => `<option value="${v.id}">${v.name} (Max: ${v.capacity}kg)</option>`).join('');
        dSelect.innerHTML = '<option value="">-- Choose Driver --</option>' + availD.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
    },

    renderFinance: function() {
        const tbody = document.getElementById('finance-tbody');
        if(!tbody) return;
        tbody.innerHTML = '';
        
        let totalCost = 0;
        let totalFuel = 0;

        const comp = this.data.trips.filter(t => t.status === 'completed');
        comp.forEach(t => {
            const v = this.data.vehicles.find(v => v.id === t.vId);
            totalCost += t.cost;
            totalFuel += (t.cost / 1.5); // Mock math
            tbody.innerHTML += `
                <tr>
                    <td><strong>${t.id}</strong></td>
                    <td>${v ? v.name : 'Unknown'}</td>
                    <td>${v ? v.odo : 0}</td>
                    <td>${(t.cost / 1.5).toFixed(1)} L</td>
                    <td>$${t.cost.toFixed(2)}</td>
                </tr>
            `;
        });

        document.getElementById('finance-total').innerText = '$' + totalCost.toFixed(2);
        document.getElementById('finance-fuel').innerText = totalFuel.toFixed(1) + ' L';
    },

    renderDrivers: function() {
        const grid = document.getElementById('driver-grid');
        grid.innerHTML = '';
        
        this.data.drivers.forEach(d => {
            const isExp = new Date(d.licenseExp) < new Date();
            const expStyle = isExp ? 'color: var(--danger); font-weight: bold;' : '';
            grid.innerHTML += `
                <div class="glass-card driver-card">
                    <img src="${d.img}" alt="${d.name}">
                    <h3>${d.name}</h3>
                    <p style="${expStyle}">License Exp: ${d.licenseExp} ${isExp ? '<i class="fa-solid fa-triangle-exclamation"></i>' : ''}</p>
                    <div style="margin-top: 10px;">${this.getBadge(d.status)}</div>
                    <div class="driver-stats">
                        <div class="stat"><strong>${d.score}</strong><span>Safety Score</span></div>
                        <div class="stat"><strong>${d.trips}</strong><span>Trips</span></div>
                    </div>
                </div>
            `;
        });
    },

    renderMaintenance: function() {
        const mSelect = document.getElementById('maint-vehicle');
        if(mSelect) {
            const availV = this.data.vehicles.filter(v => v.status === 'available');
            mSelect.innerHTML = '<option value="">-- Select Vehicle --</option>' + availV.map(v => `<option value="${v.id}">${v.name}</option>`).join('');
        }

        const list = document.getElementById('service-logs-list');
        if(list) {
            list.innerHTML = this.data.maintenanceLogs.map(m => {
                const v = this.data.vehicles.find(v => v.id === m.vId);
                return `<div style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); display:flex; justify-content: space-between; align-items: center;">
                    <div><i class="fa-solid fa-wrench" style="color:var(--danger); margin-right:10px;"></i> <strong>${v?v.name:'Unknown'}</strong>: ${m.desc}</div>
                    <button class="btn-text" onclick="app.resolveMaintenance('${m.id}')">Mark Resolved</button>
                </div>`;
            }).join('');
        }
    },

    // --- Actions & Rules (From Problem Statement) ---
    createTrip: function() {
        const vId = document.getElementById('dispatch-vehicle').value;
        const dId = document.getElementById('dispatch-driver').value;
        const cargo = parseFloat(document.getElementById('dispatch-cargo').value);
        const dest = document.getElementById('dispatch-dest').value;
        const errEl = document.getElementById('dispatch-error');
        const errText = document.getElementById('error-text');

        errEl.classList.add('hidden');

        const v = this.data.vehicles.find(v => v.id === vId);
        const d = this.data.drivers.find(d => d.id === dId);

        // Validation Rule 1: Cargo vs Capacity
        if (cargo > v.capacity) {
            errText.innerText = `Validation Failed: ${cargo}kg exceeds ${v.name}'s max capacity of ${v.capacity}kg.`;
            errEl.classList.remove('hidden');
            return;
        }

        // Validation Rule 2: Expired License
        if (new Date(d.licenseExp) < new Date()) {
            errText.innerText = `Compliance Issue: ${d.name}'s license is expired! Assignment blocked.`;
            errEl.classList.remove('hidden');
            return;
        }

        // Success - Update State
        v.status = 'on_trip';
        d.status = 'on_duty';
        
        this.data.trips.push({
            id: 'TRP-' + Math.floor(Math.random() * 900 + 100),
            vId: v.id, dId: d.id, cargo, dest, status: 'dispatched', cost: 0, rev: 0, date: new Date().toISOString()
        });

        this.saveData();
        Swal.fire('Dispatched!', 'Trip created and states automatically updated.', 'success');
        document.getElementById('create-trip-form').reset();
    },

    logMaintenance: function() {
        const vId = document.getElementById('maint-vehicle').value;
        const desc = document.getElementById('maint-desc').value;

        const v = this.data.vehicles.find(v => v.id === vId);
        if(!v) return;

        // Auto Logic: Service changes status to In Shop, hides from Dispatch
        v.status = 'in_shop';
        this.data.maintenanceLogs.push({ id: 'M' + Date.now(), vId: v.id, desc, date: new Date().toISOString() });

        this.saveData();
        Swal.fire('Logged', `${v.name} status updated to "In Shop"`, 'warning');
        document.getElementById('maintenance-form').reset();
    },

    resolveMaintenance: function(mId) {
        const idx = this.data.maintenanceLogs.findIndex(m => m.id === mId);
        if(idx > -1) {
            const vId = this.data.maintenanceLogs[idx].vId;
            const v = this.data.vehicles.find(v => v.id === vId);
            if(v) v.status = 'available'; // Release vehicle
            this.data.maintenanceLogs.splice(idx, 1);
            this.saveData();
            Swal.fire('Resolved', 'Vehicle returned to Dispatch pool', 'success');
        }
    }
};

// Start App
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
