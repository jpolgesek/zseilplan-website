if (window.addEventListener) {
	var _kk = [], _nk = "38,38,40,40,37,39,37,39,66,65";
	window.addEventListener("keydown", function(e) {
		_kk.push(e.keyCode);
		if (_kk.toString().indexOf(_nk) >= 0 ){
			scrollTo(0,0);
			document.body.innerHTML = '<div style="z-index: 99999999;position: absolute;top: 0;left: 0;width: 100%;height: 100%;"><iframe src="aee/" style="width: 100%;height: 100%;border-style:none"></iframe></div>' + document.body.innerHTML;
			scrollTo(0,0);
			_kk = [];
		}
	}, true);
}


function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function isToday(someDate){
	today = new Date();
	return someDate.getDate() == today.getDate() &&
	  someDate.getMonth() == today.getMonth() &&
	  someDate.getFullYear() == today.getFullYear();
}

app.adminPanel = {
	init: function(){
		fakeAdminCSS = document.createElement("style");
		fakeAdminCSS.innerHTML = `
		div.adminPanel{
			background: #222;
			color: #eee;
			width: 100%;
			display: flex;
			align-items: center;
			height: 41px;
		}

		div.adminPanel > button{
			padding: 5px;
			margin: 5px;
			background: #272727;
			border: 1px solid #404040;
			color: #eee;
			border-radius: 3px;
		}

		div.adminPanel > h3{
			display: inline-block;
			margin: 0;
		}

		div.adminPanel > button:hover{
			background: #444;
		}

		div.adminPanel > .t{
			font-size: 1em;
			margin-left: 20px;
		}

		.adminManage > pre{
			height: 200px;
			overflow: scroll;
		}
		
		`;

		fakeAdminHeader = document.createElement("div");
		fakeAdminHeader.className = "adminPanel"
		fakeAdminString = "<h3>/&gt Witaj jpolgesek!</h3>";
		fakeAdminString += "<span class='t'>Wyświetl:</span>";
		fakeAdminString += "<button onclick='ui.toast.show(\"Błąd HTTP 104\");'>Statystyki</button>";

		fakeAdminString += "<span class='t'>Zarządzaj:</span>";
		fakeAdminString += "<button onclick='app.adminPanel.manage(\"timetable\")'>Plan</button>";
		fakeAdminString += "<button onclick='app.adminPanel.manage(\"overrides\")'>Zastępstwa</button>";
		fakeAdminString += "<button onclick='app.adminPanel.manage(\"server\")'>Serwer</button>";

		fakeAdminString += "<span class='t'>User:</span>";
		fakeAdminString += "<button onclick='app.adminPanel.logout()'>Wyloguj</button>";
		fakeAdminHeader.innerHTML = fakeAdminString;
		document.body.appendChild(fakeAdminCSS);
		document.getElementById("container").parentElement.insertBefore(fakeAdminHeader, document.getElementById("container"));
		
		if (localStorage.getItem("april_1st_user_message") != null && localStorage.getItem("april_1st_user_message").length >= 1){
			app.ui.setStatus(escapeHtml(localStorage.getItem("april_1st_user_message")) + "<br>PS. Jeśli dobrze kojarzę to dziś jest 1 kwietnia ;)");
			app.element.status.classList.add("blue");
		}
	},

	manage: function(t){
		container = document.getElementById("container");
		container.classList.add("adminManage");

		input = document.createElement('select');
		input.type = "";
		input.checked = true;
		for (i in diff.index.timetable_archives){
			item = diff.index.timetable_archives[i];
			if (item.export_datetime == undefined){
				item.export_datetime = item.date;
			}
			input.options[input.options.length] = new Option(item.export_datetime +  ' ('+item.hash+')', 'data/' + item.filename);
		}

		if (t == "timetable"){
			container.innerHTML = `
			<h1>Zarządzanie Planem</h1>
			<hr>
			<h2 style="border: 2px solid red; border-radius: 10px; padding: 4px;">AdminPanel w trakcie konstrukcji. Większość opcji wciąż jest dostępna tylko przez config.json</h2>
			<div>Wiadomość dla użytkowników (config.userMessage):  <B>UŻYWAĆ ROZSĄDNIE: ZOBACZY TO KAŻDY ODWIEDZAJĄCY</B> </div><textarea maxlength=255 id="usermsg"></textarea>
			<p>Wersja planu: ${input.outerHTML}</p>
			<p>Źródło planu: <select><option>WWW</option><option>Vulcan</option></select></p>
			<p><input type="checkbox"> Plan w trakcie aktualizacji</p>
			<p>Wstaw nowy plan (format .prapr) <input type="file"></p>
			<button onclick='localStorage.setItem("april_1st_user_message", document.getElementById("usermsg").value.substr(0, 255)); app.adminPanel.pwdPrompt(\"tt.setmessage\", false, true)'>Zapisz zmiany!</button>
			`;
			return;
		}else if (t == "overrides"){
			container.innerHTML = `
			<h1>Zarządzanie Zastępstwami</h1>
			<hr>
			<h2 style="border: 2px solid red; border-radius: 10px; padding: 4px;">AdminPanel w trakcie konstrukcji. Większość opcji wciąż jest dostępna tylko przez config.json</h2>
			<h2 style="border: 2px solid #aa0000; background: #bb1122; color: #fff; border-radius: 10px; padding: 4px;">Wystąpił wewnętrzny błąd serwera (NullPointerException) :(</h2>
			`;
			return;
		}else if (t != "server"){
			return;
		}
		container.innerHTML = `
			<h1>Zarządzanie Serwerem</h1>
			<hr>
			<h2 style="border: 2px solid red; border-radius: 10px; padding: 4px;">AdminPanel w trakcie konstrukcji. Większość opcji wciąż jest dostępna tylko przez config.json</h2>
			<div><b>IP:</b> 127.0.0.1</div> 
			<div><b>Uptime:</b> 14 dni</div> 
			<div><b>OS:</b> SuSE Linux (Kernel 2.6.1.04-amd64)</div> 
			<button onclick='app.adminPanel.pwdPrompt(\"os.restartos\", true, true)'>Restart OS</button><br>
			<button onclick='app.adminPanel.pwdPrompt(\"os.restartfront\", false, true)'>Restart Super Clever Plan (front)</button><br>
			<button onclick='app.adminPanel.pwdPrompt(\"os.restartback\", false, true)'>Restart Super Clever Plan (back)</button><br>
			
			<h3>Ostatnie wpisy kernela</h3>
			<pre>
[    0.000000] Linux version 2.6.1.04-amd64 (suse-kernel@lists.suse.org) (gcc version 6.3.0 20170516 (suse 6.3.0-18+deb9u1) ) #1 SMP suse
[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz-2.6.1.04-amd64 root=/dev/sda1 ro quiet
[    0.000000] x86/fpu: Supporting XSAVE feature 0x001: 'x87 floating point registers'
[    0.000000] x86/fpu: Supporting XSAVE feature 0x002: 'SSE registers'
[    0.000000] x86/fpu: Enabled xstate features 0x3, context size is 576 bytes, using 'standard' format.
[    0.000000] x86/fpu: Using 'eager' FPU context switches.
[    0.000000] e820: BIOS-provided physical RAM map:
[    0.000000] BIOS-e820: [mem 0x0000000000000000-0x000000000009ebff] usable
[    0.000000] BIOS-e820: [mem 0x000000000009ec00-0x000000000009ffff] reserved
[    0.000000] BIOS-e820: [mem 0x00000000000e4000-0x00000000000fffff] reserved
[    0.000000] BIOS-e820: [mem 0x0000000000100000-0x000000009ff7ffff] usable
[    0.000000] BIOS-e820: [mem 0x000000009ff80000-0x000000009ff8dfff] ACPI data
[    0.000000] BIOS-e820: [mem 0x000000009ff8e000-0x000000009ffcffff] ACPI NVS
[    0.000000] BIOS-e820: [mem 0x000000009ffd0000-0x000000009fffffff] reserved
[    0.000000] BIOS-e820: [mem 0x00000000fee00000-0x00000000fee00fff] reserved
[    0.000000] BIOS-e820: [mem 0x00000000fff00000-0x00000000ffffffff] reserved
[    0.000000] BIOS-e820: [mem 0x0000000100000000-0x000000045fffffff] usable
[    0.000000] NX (Execute Disable) protection: active
[    0.000000] SMBIOS 2.5 present.
[    0.000000] DMI: System manufacturer System Product Name/P5P43TD PRO, BIOS 0710    11/04/2010
[    0.000000] e820: update [mem 0x00000000-0x00000fff] usable ==> reserved
[    0.000000] e820: remove [mem 0x000a0000-0x000fffff] usable
[    0.000000] e820: last_pfn = 0x460000 max_arch_pfn = 0x400000000
[    0.000000] MTRR default type: uncachable
[    0.000000] MTRR fixed ranges enabled:
[    0.000000]   00000-9FFFF write-back
[    0.000000]   A0000-BFFFF uncachable
[    0.000000]   C0000-DFFFF write-protect
[    0.000000]   E0000-EFFFF write-through
[    0.000000]   F0000-FFFFF write-protect
[    0.000000] MTRR variable ranges enabled:
[    0.000000]   0 base 000000000 mask C00000000 write-back
[    0.000000]   1 base 400000000 mask FC0000000 write-back
[    0.000000]   2 base 440000000 mask FE0000000 write-back
[    0.000000]   3 base 0A0000000 mask FE0000000 uncachable
[    0.000000]   4 base 0C0000000 mask FC0000000 uncachable
[    0.000000]   5 disabled
[    0.000000]   6 disabled
[    0.000000]   7 disabled
[    0.000000] x86/PAT: Configuration [0-7]: WB  WC  UC- UC  WB  WC  UC- WT  
[    0.000000] e820: update [mem 0xa0000000-0xffffffff] usable ==> reserved
[    0.000000] e820: last_pfn = 0x9ff80 max_arch_pfn = 0x400000000
[    0.000000] found SMP MP-table at [mem 0x000ff780-0x000ff78f] mapped at [ffff96a0c00ff780]
[    0.000000] Base memory trampoline at [ffff96a0c0098000] 98000 size 24576
[    0.000000] BRK [0x325939000, 0x325939fff] PGTABLE
[    0.000000] BRK [0x32593a000, 0x32593afff] PGTABLE
[    0.000000] BRK [0x32593b000, 0x32593bfff] PGTABLE
[    0.000000] BRK [0x32593c000, 0x32593cfff] PGTABLE
[    0.000000] BRK [0x32593d000, 0x32593dfff] PGTABLE
[    0.000000] BRK [0x32593e000, 0x32593efff] PGTABLE
[    0.000000] BRK [0x32593f000, 0x32593ffff] PGTABLE
[    0.000000] BRK [0x325940000, 0x325940fff] PGTABLE
[    0.000000] RAMDISK: [mem 0x35a97000-0x36d42fff]
[    0.000000] ACPI: Early table checksum verification disabled
[    0.000000] ACPI: RSDP 0x00000000000FB9E0 000024 (v02 ACPIAM)
[    0.000000] ACPI: XSDT 0x000000009FF80100 000054 (v01 A_M_I_ OEMXSDT  11001004 MSFT 00000097)
[    0.000000] ACPI: FACP 0x000000009FF80290 0000F4 (v03 A_M_I_ OEMFACP  11001004 MSFT 00000097)
[    0.000000] ACPI: DSDT 0x000000009FF80440 008CAC (v01 A1339  A1339001 00000001 INTL 20060113)
[    0.000000] ACPI: FACS 0x000000009FF8E000 000040
[    0.000000] ACPI: FACS 0x000000009FF8E000 000040
[    0.000000] ACPI: APIC 0x000000009FF80390 00006C (v01 A_M_I_ OEMAPIC  11001004 MSFT 00000097)
[    0.000000] ACPI: MCFG 0x000000009FF80400 00003C (v01 A_M_I_ OEMMCFG  11001004 MSFT 00000097)
[    0.000000] ACPI: OEMB 0x000000009FF8E040 000081 (v01 A_M_I_ AMI_OEM  11001004 MSFT 00000097)
[    0.000000] ACPI: HPET 0x000000009FF890F0 000038 (v01 A_M_I_ OEMHPET  11001004 MSFT 00000097)
[    0.000000] ACPI: OSFR 0x000000009FF89130 0000B0 (v01 A_M_I_ OEMOSFR  11001004 MSFT 00000097)
[    0.000000] ACPI: Local APIC address 0xfee00000
[    0.000000] No NUMA configuration found
[    0.000000] Faking a node at [mem 0x0000000000000000-0x000000045fffffff]
[    0.000000] NODE_DATA(0) allocated [mem 0x45ffee000-0x45fff2fff]
[    0.000000] Zone ranges:
[    0.000000]   DMA      [mem 0x0000000000001000-0x0000000000ffffff]
[    0.000000]   DMA32    [mem 0x0000000001000000-0x00000000ffffffff]
[    0.000000]   Normal   [mem 0x0000000100000000-0x000000045fffffff]
[    0.000000]   Device   empty
[    0.000000] Movable zone start for each node
[    0.000000] Early memory node ranges
[    0.000000]   node   0: [mem 0x0000000000001000-0x000000000009dfff]
[    0.000000]   node   0: [mem 0x0000000000100000-0x000000009ff7ffff]
[    0.000000]   node   0: [mem 0x0000000100000000-0x000000045fffffff]
[    0.000000] Initmem setup node 0 [mem 0x0000000000001000-0x000000045fffffff]
[    0.000000] On node 0 totalpages: 4194077
[    0.000000]   DMA zone: 64 pages used for memmap
[    0.000000]   DMA zone: 21 pages reserved
[    0.000000]   DMA zone: 3997 pages, LIFO batch:0
[    0.000000]   DMA32 zone: 10174 pages used for memmap
[    0.000000]   DMA32 zone: 651136 pages, LIFO batch:31
[    0.000000]   Normal zone: 55296 pages used for memmap
[    0.000000]   Normal zone: 3538944 pages, LIFO batch:31
[    0.000000] ACPI: PM-Timer IO Port: 0x808
[    0.000000] ACPI: Local APIC address 0xfee00000
[    0.000000] IOAPIC[0]: apic_id 4, version 32, address 0xfec00000, GSI 0-23
[    0.000000] ACPI: INT_SRC_OVR (bus 0 bus_irq 0 global_irq 2 dfl dfl)
[    0.000000] ACPI: INT_SRC_OVR (bus 0 bus_irq 9 global_irq 9 high level)
[    0.000000] ACPI: IRQ0 used by override.
[    0.000000] ACPI: IRQ9 used by override.
[    0.000000] Using ACPI (MADT) for SMP configuration information
[    0.000000] ACPI: HPET id: 0x8086a301 base: 0xfed00000
[    0.000000] smpboot: Allowing 4 CPUs, 0 hotplug CPUs
[    0.000000] PM: Registered nosave memory: [mem 0x00000000-0x00000fff]
[    0.000000] PM: Registered nosave memory: [mem 0x0009e000-0x0009efff]
[    0.000000] PM: Registered nosave memory: [mem 0x0009f000-0x0009ffff]
[    0.000000] PM: Registered nosave memory: [mem 0x000a0000-0x000e3fff]
[    0.000000] PM: Registered nosave memory: [mem 0x000e4000-0x000fffff]
[    0.000000] PM: Registered nosave memory: [mem 0x9ff80000-0x9ff8dfff]
[    0.000000] PM: Registered nosave memory: [mem 0x9ff8e000-0x9ffcffff]
[    0.000000] PM: Registered nosave memory: [mem 0x9ffd0000-0x9fffffff]
[    0.000000] PM: Registered nosave memory: [mem 0xa0000000-0xfedfffff]
[    0.000000] PM: Registered nosave memory: [mem 0xfee00000-0xfee00fff]
[    0.000000] PM: Registered nosave memory: [mem 0xfee01000-0xffefffff]
[    0.000000] PM: Registered nosave memory: [mem 0xfff00000-0xffffffff]
[    0.000000] e820: [mem 0xa0000000-0xfedfffff] available for PCI devices
[    0.000000] Booting paravirtualized kernel on bare hardware
[    0.000000] clocksource: refined-jiffies: mask: 0xffffffff max_cycles: 0xffffffff, max_idle_ns: 7645519600211568 ns
[    0.000000] setup_percpu: NR_CPUS:512 nr_cpumask_bits:512 nr_cpu_ids:4 nr_node_ids:1
[    0.000000] percpu: Embedded 35 pages/cpu @ffff96a51fc00000 s105304 r8192 d29864 u524288
[    0.000000] pcpu-alloc: s105304 r8192 d29864 u524288 alloc=1*2097152
[    0.000000] pcpu-alloc: [0] 0 1 2 3 
[    0.000000] Built 1 zonelists in Node order, mobility grouping on.  Total pages: 4128522
[    0.000000] Policy zone: Normal
[    0.000000] PID hash table entries: 4096 (order: 3, 32768 bytes)
[    0.000000] Calgary: detecting Calgary via BIOS EBDA area
[    0.000000] Calgary: Unable to locate Rio Grande table in EBDA - bailing!
[    0.000000] Memory: 16412676K/16776308K available (6240K kernel code, 1159K rwdata, 2868K rodata, 1416K init, 688K bss, 363632K reserved, 0K cma-reserved)
[    0.000000] Kernel/User page tables isolation: enabled
[    0.000000] Hierarchical RCU implementation.
[    0.000000] 	Build-time adjustment of leaf fanout to 64.
[    0.000000] 	RCU restricting CPUs from NR_CPUS=512 to nr_cpu_ids=4.
[    0.000000] RCU: Adjusting geometry for rcu_fanout_leaf=64, nr_cpu_ids=4
[    0.000000] NR_IRQS:33024 nr_irqs:456 16
[    0.000000] Console: colour VGA+ 80x25
[    0.000000] console [tty0] enabled
[    0.000000] clocksource: hpet: mask: 0xffffffff max_cycles: 0xffffffff, max_idle_ns: 133484882848 ns
[    0.000000] hpet clockevent registered
[    0.000000] tsc: Fast TSC calibration using PIT
[    0.000000] tsc: Detected 3000.024 MHz processor
[    0.004009] Calibrating delay loop (skipped), value calculated using timer frequency.. 6000.04 BogoMIPS (lpj=12000096)
[    0.004012] pid_max: default: 32768 minimum: 301
[    0.004028] ACPI: Core revision 20160831
[    0.012282] ACPI: 1 ACPI AML tables successfully acquired and loaded
[    0.012335] Security Framework initialized
[    0.012337] Yama: disabled by default; enable with sysctl kernel.yama.*
[    0.012342] AppArmor: AppArmor disabled by boot time parameter
[    0.013314] Dentry cache hash table entries: 2097152 (order: 12, 16777216 bytes)
[    0.018298] Inode-cache hash table entries: 1048576 (order: 11, 8388608 bytes)
[    0.020635] Mount-cache hash table entries: 32768 (order: 6, 262144 bytes)
[    0.020651] Mountpoint-cache hash table entries: 32768 (order: 6, 262144 bytes)
[    0.021062] CPU: Physical Processor ID: 0
[    0.021063] CPU: Processor Core ID: 0
[    0.021064] mce: CPU supports 6 MCE banks
[    0.021070] CPU0: Thermal monitoring enabled (TM2)
[    0.021075] process: using mwait in idle threads
[    0.159261] pci_bus 0000:00: root bus resource [io  0x0000-0x0cf7 window]
[    0.159263] pci_bus 0000:00: root bus resource [io  0x0d00-0xffff window]
[    0.159264] pci_bus 0000:00: root bus resource [mem 0x000a0000-0x000bffff window]
[    0.159266] pci_bus 0000:00: root bus resource [mem 0x000d0000-0x000dffff window]
[    0.159267] pci_bus 0000:00: root bus resource [mem 0xa0000000-0xffffffff window]
[    0.159269] pci_bus 0000:00: root bus resource [bus 00-ff]
[    0.159276] pci 0000:00:00.0: [8086:2e20] type 00 class 0x060000
[    0.159294] DMAR: Forcing write-buffer flush capability
[    0.159295] DMAR: Disabling IOMMU for graphics on this chipset
[    0.159375] pci 0000:00:01.0: [8086:2e21] type 01 class 0x060400
[    0.159405] pci 0000:00:01.0: PME# supported from D0 D3hot D3cold
[    0.159449] pci 0000:00:01.0: System wakeup disabled by ACPI
[    0.159509] pci 0000:00:1a.0: [8086:3a37] type 00 class 0x0c0300
[    0.159543] pci 0000:00:1a.0: reg 0x20: [io  0xb800-0xb81f]
[    0.159628] pci 0000:00:1a.0: System wakeup disabled by ACPI
[    0.159673] pci 0000:00:1a.1: [8086:3a38] type 00 class 0x0c0300
[    0.159706] pci 0000:00:1a.1: reg 0x20: [io  0xb880-0xb89f]
[    0.159789] pci 0000:00:1a.1: System wakeup disabled by ACPI
[    0.159834] pci 0000:00:1a.2: [8086:3a39] type 00 class 0x0c0300
[    0.159867] pci 0000:00:1a.2: reg 0x20: [io  0xbc00-0xbc1f]
[    0.159950] pci 0000:00:1a.2: System wakeup disabled by ACPI
[    0.160003] pci 0000:00:1a.7: [8086:3a3c] type 00 class 0x0c0320
[    0.160018] pci 0000:00:1a.7: reg 0x10: [mem 0xbffff000-0xbffff3ff]
[    0.160089] pci 0000:00:1a.7: PME# supported from D0 D3hot D3cold
[    0.160134] pci 0000:00:1a.7: System wakeup disabled by ACPI
[    0.160182] pci 0000:00:1b.0: [8086:3a3e] type 00 class 0x040300
[    0.160195] pci 0000:00:1b.0: reg 0x10: [mem 0xbfff8000-0xbfffbfff 64bit]
[    0.160253] pci 0000:00:1b.0: PME# supported from D0 D3hot D3cold
[    0.160337] pci 0000:00:1c.0: [8086:3a40] type 01 class 0x060400
[    0.160395] pci 0000:00:1c.0: PME# supported from D0 D3hot D3cold
[    0.160444] pci 0000:00:1c.0: System wakeup disabled by ACPI
[    0.160488] pci 0000:00:1c.1: [8086:3a42] type 01 class 0x060400
[    0.160545] pci 0000:00:1c.1: PME# supported from D0 D3hot D3cold
[    0.160593] pci 0000:00:1c.1: System wakeup disabled by ACPI
[    0.160638] pci 0000:00:1c.4: [8086:3a48] type 01 class 0x060400
[    0.160695] pci 0000:00:1c.4: PME# supported from D0 D3hot D3cold
[    0.160744] pci 0000:00:1c.4: System wakeup disabled by ACPI
[    0.160788] pci 0000:00:1c.5: [8086:3a4a] type 01 class 0x060400
[    0.160845] pci 0000:00:1c.5: PME# supported from D0 D3hot D3cold
[    0.160894] pci 0000:00:1c.5: System wakeup disabled by ACPI
[    0.160939] pci 0000:00:1d.0: [8086:3a34] type 00 class 0x0c0300
[    0.160972] pci 0000:00:1d.0: reg 0x20: [io  0xb080-0xb09f]
[    0.161056] pci 0000:00:1d.0: System wakeup disabled by ACPI
[    0.161101] pci 0000:00:1d.1: [8086:3a35] type 00 class 0x0c0300
[    0.161135] pci 0000:00:1d.1: reg 0x20: [io  0xb400-0xb41f]
[    0.161219] pci 0000:00:1d.1: System wakeup disabled by ACPI
[    0.161263] pci 0000:00:1d.2: [8086:3a36] type 00 class 0x0c0300
[    0.161296] pci 0000:00:1d.2: reg 0x20: [io  0xb480-0xb49f]
[    0.161379] pci 0000:00:1d.2: System wakeup disabled by ACPI
[    0.161429] pci 0000:00:1d.7: [8086:3a3a] type 00 class 0x0c0320
[    0.161443] pci 0000:00:1d.7: reg 0x10: [mem 0xbfffe000-0xbfffe3ff]
[    0.161514] pci 0000:00:1d.7: PME# supported from D0 D3hot D3cold
[    0.161559] pci 0000:00:1d.7: System wakeup disabled by ACPI
[    0.161608] pci 0000:00:1e.0: [8086:244e] type 01 class 0x060401
[    0.161686] pci 0000:00:1e.0: System wakeup disabled by ACPI
[    0.161731] pci 0000:00:1f.0: [8086:3a16] type 00 class 0x060100
[    0.161798] pci 0000:00:1f.0: quirk: [io  0x0800-0x087f] claimed by ICH6 ACPI/GPIO/TCO
[    0.161802] pci 0000:00:1f.0: quirk: [io  0x0500-0x053f] claimed by ICH6 GPIO
[    0.161805] pci 0000:00:1f.0: ICH7 LPC Generic IO decode 1 PIO at 0294 (mask 0003)
[    0.161906] pci 0000:00:1f.2: [8086:3a22] type 00 class 0x010601
[    0.161918] pci 0000:00:1f.2: reg 0x10: [io  0xac00-0xac07]
[    0.161924] pci 0000:00:1f.2: reg 0x14: [io  0xa880-0xa883]
[    0.161930] pci 0000:00:1f.2: reg 0x18: [io  0xa800-0xa807]
[    0.161936] pci 0000:00:1f.2: reg 0x1c: [io  0xa480-0xa483]
[    0.161942] pci 0000:00:1f.2: reg 0x20: [io  0xa400-0xa41f]
[    0.161949] pci 0000:00:1f.2: reg 0x24: [mem 0xbfffc000-0xbfffc7ff]
[    0.161982] pci 0000:00:1f.2: PME# supported from D3hot
[    0.162064] pci 0000:00:1f.3: [8086:3a30] type 00 class 0x0c0500
[    0.162076] pci 0000:00:1f.3: reg 0x10: [mem 0xbfffd000-0xbfffd0ff 64bit]
[    0.162092] pci 0000:00:1f.3: reg 0x20: [io  0x0400-0x041f]
[    0.162212] pci 0000:01:00.0: [1002:5b60] type 00 class 0x030000
[    0.162221] pci 0000:01:00.0: reg 0x10: [mem 0xa0000000-0xa7ffffff pref]
[    0.162227] pci 0000:01:00.0: reg 0x14: [io  0xc000-0xc0ff]
[    0.162233] pci 0000:01:00.0: reg 0x18: [mem 0xc0000000-0xc000ffff]
[    0.162252] pci 0000:01:00.0: reg 0x30: [mem 0xdffc0000-0xdffdffff pref]
[    0.162280] pci 0000:01:00.0: supports D1 D2
[    0.162328] pci 0000:01:00.1: [1002:5b70] type 00 class 0x038000
[    0.162336] pci 0000:01:00.1: reg 0x10: [mem 0xdfff0000-0xdfffffff]
[    0.162386] pci 0000:01:00.1: supports D1 D2
[    0.162427] pci 0000:01:00.0: disabling ASPM on pre-1.1 PCIe device.  You can enable it with 'pcie_aspm=force'
[    0.162433] pci 0000:00:01.0: PCI bridge to [bus 01]
[    0.162435] pci 0000:00:01.0:   bridge window [io  0xc000-0xcfff]
[    0.162437] pci 0000:00:01.0:   bridge window [mem 0xc0000000-0xdfffffff]
[    0.162440] pci 0000:00:01.0:   bridge window [mem 0xa0000000-0xafffffff 64bit pref]
[    0.162479] pci 0000:00:1c.0: PCI bridge to [bus 05]
[    0.162486] pci 0000:00:1c.0:   bridge window [mem 0xbee00000-0xbeefffff 64bit pref]
[    0.162552] pci 0000:04:00.0: [197b:2380] type 00 class 0x0c0010
[    0.162575] pci 0000:04:00.0: reg 0x10: [mem 0xfcfff800-0xfcffffff]
[    0.162590] pci 0000:04:00.0: reg 0x14: [mem 0xfcfff400-0xfcfff47f]
[    0.162631] pci 0000:04:00.0: reg 0x20: [mem 0xfcfff000-0xfcfff07f]
[    0.162646] pci 0000:04:00.0: reg 0x24: [mem 0xfcffec00-0xfcffec7f]
[    0.176017] pci 0000:00:1c.1: PCI bridge to [bus 04]
[    0.176022] pci 0000:00:1c.1:   bridge window [mem 0xfcf00000-0xfcffffff]
[    0.176103] pci 0000:03:00.0: [197b:2361] type 00 class 0x010601
[    0.176190] pci 0000:03:00.0: reg 0x24: [mem 0xfcefe000-0xfcefffff]
[    0.176202] pci 0000:03:00.0: reg 0x30: [mem 0xfcee0000-0xfceeffff pref]
[    0.176253] pci 0000:03:00.0: PME# supported from D3hot
[    0.176326] pci 0000:03:00.1: [197b:2361] type 00 class 0x010185
[    0.176344] pci 0000:03:00.1: reg 0x10: [io  0xec00-0xec07]
[    0.176353] pci 0000:03:00.1: reg 0x14: [io  0xe880-0xe883]
[    0.176361] pci 0000:03:00.1: reg 0x18: [io  0xe800-0xe807]
[    0.176370] pci 0000:03:00.1: reg 0x1c: [io  0xe480-0xe483]
[    0.176379] pci 0000:03:00.1: reg 0x20: [io  0xe400-0xe40f]
[    0.176489] pci 0000:03:00.0: disabling ASPM on pre-1.1 PCIe device.  You can enable it with 'pcie_aspm=force'
[    0.176497] pci 0000:00:1c.4: PCI bridge to [bus 03]
[    0.176500] pci 0000:00:1c.4:   bridge window [io  0xe000-0xefff]
[    0.176503] pci 0000:00:1c.4:   bridge window [mem 0xfce00000-0xfcefffff]
[    0.176559] pci 0000:02:00.0: [1969:1026] type 00 class 0x020000
[    0.176582] pci 0000:02:00.0: reg 0x10: [mem 0xfcdc0000-0xfcdfffff 64bit]
[    0.176592] pci 0000:02:00.0: reg 0x18: [io  0xdc00-0xdc7f]
[    0.176684] pci 0000:02:00.0: PME# supported from D3hot D3cold
[    0.176746] pci 0000:02:00.0: disabling ASPM on pre-1.1 PCIe device.  You can enable it with 'pcie_aspm=force'
[    0.176754] pci 0000:00:1c.5: PCI bridge to [bus 02]
[    0.176756] pci 0000:00:1c.5:   bridge window [io  0xd000-0xdfff]
[    0.176759] pci 0000:00:1c.5:   bridge window [mem 0xfcd00000-0xfcdfffff]
[    0.176800] pci 0000:06:00.0: [1131:7133] type 00 class 0x048000
[    0.176813] pci 0000:06:00.0: reg 0x10: [mem 0xfebff800-0xfebfffff]
[    0.176879] pci 0000:06:00.0: supports D1 D2
[    0.176922] pci 0000:06:01.0: [14f1:8800] type 00 class 0x040000
[    0.176936] pci 0000:06:01.0: reg 0x10: [mem 0xfd000000-0xfdffffff]
[    0.177052] pci 0000:06:02.0: [109e:036e] type 00 class 0x040000
[    0.177066] pci 0000:06:02.0: reg 0x10: [mem 0xbeffe000-0xbeffefff pref]
[    0.177177] pci 0000:06:02.1: [109e:0878] type 00 class 0x048000
[    0.177191] pci 0000:06:02.1: reg 0x10: [mem 0xbefff000-0xbeffffff pref]
[    0.177329] pci 0000:00:1e.0: PCI bridge to [bus 06] (subtractive decode)
[    0.177333] pci 0000:00:1e.0:   bridge window [mem 0xfd000000-0xfebfffff]
[    0.177337] pci 0000:00:1e.0:   bridge window [mem 0xbef00000-0xbeffffff 64bit pref]
[    0.177339] pci 0000:00:1e.0:   bridge window [io  0x0000-0x0cf7 window] (subtractive decode)
[    0.177341] pci 0000:00:1e.0:   bridge window [io  0x0d00-0xffff window] (subtractive decode)
[    0.177342] pci 0000:00:1e.0:   bridge window [mem 0x000a0000-0x000bffff window] (subtractive decode)
[    0.177344] pci 0000:00:1e.0:   bridge window [mem 0x000d0000-0x000dffff window] (subtractive decode)
[    0.177345] pci 0000:00:1e.0:   bridge window [mem 0xa0000000-0xffffffff window] (subtractive decode)
[    0.178038] ACPI: PCI Interrupt Link [LNKA] (IRQs 3 4 5 6 7 *10 11 12 14 15)
[    0.178093] ACPI: PCI Interrupt Link [LNKB] (IRQs 3 4 5 6 7 10 *11 12 14 15)
[    0.178146] ACPI: PCI Interrupt Link [LNKC] (IRQs 3 4 5 6 7 10 11 12 14 *15)
[    0.178199] ACPI: PCI Interrupt Link [LNKD] (IRQs 3 4 *5 6 7 10 11 12 14 15)
[    0.178251] ACPI: PCI Interrupt Link [LNKE] (IRQs 3 4 5 6 7 10 11 12 14 15) *0, disabled.
[    0.178305] ACPI: PCI Interrupt Link [LNKF] (IRQs 3 4 5 6 7 10 11 12 *14 15)
[    0.178358] ACPI: PCI Interrupt Link [LNKG] (IRQs *3 4 5 6 7 10 11 12 14 15)
[    0.178411] ACPI: PCI Interrupt Link [LNKH] (IRQs 3 4 5 *6 7 10 11 12 14 15)
[    0.178469] ACPI: Enabled 3 GPEs in block 00 to 3F
[    0.180013] vgaarb: setting as boot device: PCI:0000:01:00.0
[    0.180013] vgaarb: device added: PCI:0000:01:00.0,decodes=io+mem,owns=io+mem,locks=none
[    0.180013] vgaarb: loaded
[    0.180014] vgaarb: bridge control possible 0000:01:00.0
[    0.180074] PCI: Using ACPI for IRQ routing
[    0.180957] PCI: pci_cache_line_size set to 64 bytes
[    0.181020] e820: reserve RAM buffer [mem 0x0009ec00-0x0009ffff]
[    0.181021] e820: reserve RAM buffer [mem 0x9ff80000-0x9fffffff]
[    0.184026] HPET: 4 timers in total, 0 timers will be used for per-cpu timer
[    0.184030] hpet0: at MMIO 0xfed00000, IRQs 2, 8, 0, 0
[    0.184033] hpet0: 4 comparators, 64-bit 14.318180 MHz counter
[    0.186039] clocksource: Switched to clocksource hpet
[    0.191722] VFS: Disk quotas dquot_6.6.0
[    0.191762] VFS: Dquot-cache hash table entries: 512 (order 0, 4096 bytes)
[    0.191865] pnp: PnP ACPI init
[    0.191961] system 00:00: [mem 0xfed14000-0xfed19fff] has been reserved
[    0.191965] system 00:00: Plug and Play ACPI device, IDs PNP0c01 (active)
[    0.192057] pnp 00:01: Plug and Play ACPI device, IDs PNP0b00 (active)
[    0.192343] pnp 00:02: [dma 3]
[    0.192455] pnp 00:02: Plug and Play ACPI device, IDs PNP0401 (active)
[    0.192524] system 00:03: [io  0x0290-0x0297] has been reserved
[    0.192527] system 00:03: Plug and Play ACPI device, IDs PNP0c02 (active)
[    0.192678] system 00:04: [io  0x04d0-0x04d1] has been reserved
[    0.192680] system 00:04: [io  0x0800-0x087f] has been reserved
[    0.192681] system 00:04: [io  0x0500-0x057f] could not be reserved
[    0.192684] system 00:04: [mem 0xfed08000-0xfed08fff] has been reserved
[    0.192686] system 00:04: [mem 0xfed1c000-0xfed1ffff] has been reserved
[    0.192687] system 00:04: [mem 0xfed20000-0xfed3ffff] has been reserved
[    0.192689] system 00:04: [mem 0xfed50000-0xfed8ffff] has been reserved
[    0.192692] system 00:04: Plug and Play ACPI device, IDs PNP0c02 (active)
[    0.192801] system 00:05: [mem 0xffc00000-0xffefffff] has been reserved
[    0.192804] system 00:05: Plug and Play ACPI device, IDs PNP0c02 (active)
[    0.192993] pnp 00:06: [dma 0 disabled]
[    0.193057] pnp 00:06: Plug and Play ACPI device, IDs PNP0501 (active)
[    0.193184] system 00:07: [mem 0xfec00000-0xfec00fff] could not be reserved
[    0.193186] system 00:07: [mem 0xfee00000-0xfee00fff] has been reserved
[    0.193189] system 00:07: Plug and Play ACPI device, IDs PNP0c02 (active)
[    0.193285] system 00:08: [mem 0xe0000000-0xefffffff] has been reserved
[    0.193288] system 00:08: Plug and Play ACPI device, IDs PNP0c02 (active)
[    0.193455] system 00:09: [mem 0x00000000-0x0009ffff] could not be reserved
[    0.193457] system 00:09: [mem 0x000c0000-0x000cffff] could not be reserved
[    0.193459] system 00:09: [mem 0x000e0000-0x000fffff] could not be reserved
[    0.193461] system 00:09: [mem 0x00100000-0x9fffffff] could not be reserved
[    0.193463] system 00:09: Plug and Play ACPI device, IDs PNP0c01 (active)
[    0.193579] pnp: PnP ACPI: found 10 devices
[    0.200104] clocksource: acpi_pm: mask: 0xffffff max_cycles: 0xffffff, max_idle_ns: 2085701024 ns
[    0.200121] pci 0000:00:1c.0: bridge window [io  0x1000-0x0fff] to [bus 05] add_size 1000
[    0.200124] pci 0000:00:1c.0: bridge window [mem 0x00100000-0x000fffff] to [bus 05] add_size 400000 add_align 100000
[    0.200130] pci 0000:00:1c.1: bridge window [io  0x1000-0x0fff] to [bus 04] add_size 1000
[    0.200133] pci 0000:00:1c.1: bridge window [mem 0x00100000-0x000fffff 64bit pref] to [bus 04] add_size 200000 add_align 100000
[    0.200140] pci 0000:00:1c.4: bridge window [mem 0x00100000-0x000fffff 64bit pref] to [bus 03] add_size 200000 add_align 100000
[    0.200147] pci 0000:00:1c.5: bridge window [mem 0x00100000-0x000fffff 64bit pref] to [bus 02] add_size 200000 add_align 100000
[    0.200157] pci 0000:00:1c.0: res[14]=[mem 0x00100000-0x000fffff] res_to_dev_res add_size 400000 min_align 100000
[    0.200159] pci 0000:00:1c.0: res[14]=[mem 0x00100000-0x004fffff] res_to_dev_res add_size 400000 min_align 100000
[    0.200161] pci 0000:00:1c.1: res[15]=[mem 0x00100000-0x000fffff 64bit pref] res_to_dev_res add_size 200000 min_align 100000
[    0.200163] pci 0000:00:1c.1: res[15]=[mem 0x00100000-0x002fffff 64bit pref] res_to_dev_res add_size 200000 min_align 100000
[    0.200165] pci 0000:00:1c.4: res[15]=[mem 0x00100000-0x000fffff 64bit pref] res_to_dev_res add_size 200000 min_align 100000
[    0.200166] pci 0000:00:1c.4: res[15]=[mem 0x00100000-0x002fffff 64bit pref] res_to_dev_res add_size 200000 min_align 100000
[    0.200168] pci 0000:00:1c.5: res[15]=[mem 0x00100000-0x000fffff 64bit pref] res_to_dev_res add_size 200000 min_align 100000
[    0.200170] pci 0000:00:1c.5: res[15]=[mem 0x00100000-0x002fffff 64bit pref] res_to_dev_res add_size 200000 min_align 100000
[    0.200172] pci 0000:00:1c.0: res[13]=[io  0x1000-0x0fff] res_to_dev_res add_size 1000 min_align 1000
[    0.200174] pci 0000:00:1c.0: res[13]=[io  0x1000-0x1fff] res_to_dev_res add_size 1000 min_align 1000
[    0.200175] pci 0000:00:1c.1: res[13]=[io  0x1000-0x0fff] res_to_dev_res add_size 1000 min_align 1000
[    0.200177] pci 0000:00:1c.1: res[13]=[io  0x1000-0x1fff] res_to_dev_res add_size 1000 min_align 1000
[    0.200181] pci 0000:00:1c.0: BAR 14: assigned [mem 0xb0000000-0xb03fffff]
[    0.200185] pci 0000:00:1c.1: BAR 15: assigned [mem 0xb0400000-0xb05fffff 64bit pref]
[    0.200189] pci 0000:00:1c.4: BAR 15: assigned [mem 0xb0600000-0xb07fffff 64bit pref]
[    0.200192] pci 0000:00:1c.5: BAR 15: assigned [mem 0xb0800000-0xb09fffff 64bit pref]
[    0.200195] pci 0000:00:1c.0: BAR 13: assigned [io  0x1000-0x1fff]
[    0.200197] pci 0000:00:1c.1: BAR 13: assigned [io  0x2000-0x2fff]
[    0.200200] pci 0000:00:01.0: PCI bridge to [bus 01]
[    0.200202] pci 0000:00:01.0:   bridge window [io  0xc000-0xcfff]
[    0.200205] pci 0000:00:01.0:   bridge window [mem 0xc0000000-0xdfffffff]
[    0.200207] pci 0000:00:01.0:   bridge window [mem 0xa0000000-0xafffffff 64bit pref]
[    0.200210] pci 0000:00:1c.0: PCI bridge to [bus 05]
[    0.200212] pci 0000:00:1c.0:   bridge window [io  0x1000-0x1fff]
[    0.200215] pci 0000:00:1c.0:   bridge window [mem 0xb0000000-0xb03fffff]
[    0.200218] pci 0000:00:1c.0:   bridge window [mem 0xbee00000-0xbeefffff 64bit pref]
[    0.200223] pci 0000:00:1c.1: PCI bridge to [bus 04]
[    0.200225] pci 0000:00:1c.1:   bridge window [io  0x2000-0x2fff]
[    0.200228] pci 0000:00:1c.1:   bridge window [mem 0xfcf00000-0xfcffffff]
[    0.200231] pci 0000:00:1c.1:   bridge window [mem 0xb0400000-0xb05fffff 64bit pref]
[    0.200235] pci 0000:00:1c.4: PCI bridge to [bus 03]
[    0.200237] pci 0000:00:1c.4:   bridge window [io  0xe000-0xefff]
[    0.200241] pci 0000:00:1c.4:   bridge window [mem 0xfce00000-0xfcefffff]
[    0.200244] pci 0000:00:1c.4:   bridge window [mem 0xb0600000-0xb07fffff 64bit pref]
[    0.200248] pci 0000:00:1c.5: PCI bridge to [bus 02]
[    0.200250] pci 0000:00:1c.5:   bridge window [io  0xd000-0xdfff]
[    0.200253] pci 0000:00:1c.5:   bridge window [mem 0xfcd00000-0xfcdfffff]
[    0.200256] pci 0000:00:1c.5:   bridge window [mem 0xb0800000-0xb09fffff 64bit pref]
[    0.200261] pci 0000:00:1e.0: PCI bridge to [bus 06]
[    0.200265] pci 0000:00:1e.0:   bridge window [mem 0xfd000000-0xfebfffff]
[    0.200268] pci 0000:00:1e.0:   bridge window [mem 0xbef00000-0xbeffffff 64bit pref]
[    0.200272] pci_bus 0000:00: resource 4 [io  0x0000-0x0cf7 window]
[    0.200274] pci_bus 0000:00: resource 5 [io  0x0d00-0xffff window]
[    0.200276] pci_bus 0000:00: resource 6 [mem 0x000a0000-0x000bffff window]
[    0.200277] pci_bus 0000:00: resource 7 [mem 0x000d0000-0x000dffff window]
[    0.200278] pci_bus 0000:00: resource 8 [mem 0xa0000000-0xffffffff window]
[    0.200280] pci_bus 0000:01: resource 0 [io  0xc000-0xcfff]
[    0.200282] pci_bus 0000:01: resource 1 [mem 0xc0000000-0xdfffffff]
[    0.200283] pci_bus 0000:01: resource 2 [mem 0xa0000000-0xafffffff 64bit pref]
[    0.200285] pci_bus 0000:05: resource 0 [io  0x1000-0x1fff]
[    0.200286] pci_bus 0000:05: resource 1 [mem 0xb0000000-0xb03fffff]
[    0.200288] pci_bus 0000:05: resource 2 [mem 0xbee00000-0xbeefffff 64bit pref]
[    0.200289] pci_bus 0000:04: resource 0 [io  0x2000-0x2fff]
[    0.200291] pci_bus 0000:04: resource 1 [mem 0xfcf00000-0xfcffffff]
[    0.200292] pci_bus 0000:04: resource 2 [mem 0xb0400000-0xb05fffff 64bit pref]
[    0.200294] pci_bus 0000:03: resource 0 [io  0xe000-0xefff]
[    0.200295] pci_bus 0000:03: resource 1 [mem 0xfce00000-0xfcefffff]
[    0.200296] pci_bus 0000:03: resource 2 [mem 0xb0600000-0xb07fffff 64bit pref]
[    0.200298] pci_bus 0000:02: resource 0 [io  0xd000-0xdfff]
[    0.200299] pci_bus 0000:02: resource 1 [mem 0xfcd00000-0xfcdfffff]
[    0.200301] pci_bus 0000:02: resource 2 [mem 0xb0800000-0xb09fffff 64bit pref]
[    0.200302] pci_bus 0000:06: resource 1 [mem 0xfd000000-0xfebfffff]
[    0.200304] pci_bus 0000:06: resource 2 [mem 0xbef00000-0xbeffffff 64bit pref]
[    0.200305] pci_bus 0000:06: resource 4 [io  0x0000-0x0cf7 window]
[    0.200307] pci_bus 0000:06: resource 5 [io  0x0d00-0xffff window]
[    0.200308] pci_bus 0000:06: resource 6 [mem 0x000a0000-0x000bffff window]
[    0.200310] pci_bus 0000:06: resource 7 [mem 0x000d0000-0x000dffff window]
[    0.200311] pci_bus 0000:06: resource 8 [mem 0xa0000000-0xffffffff window]
[    0.200432] NET: Registered protocol family 2
[    0.200654] TCP established hash table entries: 131072 (order: 8, 1048576 bytes)
[    0.200919] TCP bind hash table entries: 65536 (order: 8, 1048576 bytes)
[    0.201128] TCP: Hash tables configured (established 131072 bind 65536)
[    0.201183] UDP hash table entries: 8192 (order: 6, 262144 bytes)
[    0.201264] UDP-Lite hash table entries: 8192 (order: 6, 262144 bytes)
[    0.201425] NET: Registered protocol family 1
[    0.202510] pci 0000:01:00.0: Video device with shadowed ROM at [mem 0x000c0000-0x000dffff]
[    0.202518] pci 0000:03:00.0: async suspend disabled to avoid multi-function power-on ordering issue
[    0.202522] pci 0000:03:00.1: async suspend disabled to avoid multi-function power-on ordering issue
[    0.202535] PCI: CLS 32 bytes, default 64
[    0.202590] Unpacking initramfs...
[    0.522591] Freeing initrd memory: 19120K
[    0.522636] PCI-DMA: Using software bounce buffering for IO (SWIOTLB)
[    0.522639] software IO TLB [mem 0x9bf80000-0x9ff80000] (64MB) mapped at [ffff96a15bf80000-ffff96a15ff7ffff]
[    0.523084] audit: initializing netlink subsys (disabled)
[    0.523105] audit: type=2000 audit(1552212937.520:1): initialized
[    0.523522] workingset: timestamp_bits=40 max_order=22 bucket_order=0
[    0.523605] zbud: loaded
[    0.524639] Block layer SCSI generic (bsg) driver version 0.4 loaded (major 250)
[    0.524689] io scheduler noop registered
[    0.524690] io scheduler deadline registered
[    0.524706] io scheduler cfq registered (default)
[    0.524943] pcieport 0000:00:1c.0: enabling device (0106 -> 0107)
[    0.525077] pcieport 0000:00:1c.1: enabling device (0106 -> 0107)
[    0.525460] pci_hotplug: PCI Hot Plug PCI Core version: 0.5
[    0.525465] pciehp: PCI Express Hot Plug Controller Driver version: 0.4
[    0.525482] intel_idle: does not run on family 6 model 23
[    0.525815] GHES: HEST is not enabled!
[    0.525878] Serial: 8250/16550 driver, 4 ports, IRQ sharing enabled
[    0.546273] 00:06: ttyS0 at I/O 0x3f8 (irq = 4, base_baud = 115200) is a 16550A
[    0.546642] Linux agpgart interface v0.103
[    0.546804] AMD IOMMUv2 driver by Joerg Roedel <jroedel@suse.de>
[    0.546805] AMD IOMMUv2 functionality not available on this system
[    0.547131] i8042: PNP: No PS/2 controller found. Probing ports directly.
[    0.549908] serio: i8042 KBD port at 0x60,0x64 irq 1
[    0.549916] serio: i8042 AUX port at 0x60,0x64 irq 12
[    0.550047] mousedev: PS/2 mouse device common for all mice
[    0.550088] rtc_cmos 00:01: RTC can wake from S4
[    0.550197] rtc_cmos 00:01: rtc core: registered rtc_cmos as rtc0
[    0.550217] rtc_cmos 00:01: alarms up to one month, y3k, 114 bytes nvram, hpet irqs
[    0.550272] ledtrig-cpu: registered to indicate activity on CPUs
[    0.550778] NET: Registered protocol family 10
[    0.550999] mip6: Mobile IPv6
[    0.551001] NET: Registered protocol family 17
[    0.551002] mpls_gso: MPLS GSO support
[    0.551198] microcode: sig=0x1067a, pf=0x10, revision=0xa07
[    0.551257] microcode: Microcode Update Driver: v2.01 <tigran@aivazian.fsnet.co.uk>, Peter Oruba
[    0.551379] registered taskstats version 1
[    0.551394] zswap: loaded using pool lzo/zbud
[    0.551519] ima: No TPM chip found, activating TPM-bypass!
[    2.223376] usbcore: registered new interface driver usbhid
[    2.223377] usbhid: USB HID core driver
[    2.224103] input: BTC USB Multimedia Keyboard as /devices/pci0000:00/0000:00:1d.2/usb6/6-1/6-1:1.0/0003:046E:5500.0001/input/input3
[    2.284154] hid-generic 0003:046E:5500.0001: input,hidraw0: USB HID v1.10 Keyboard [BTC USB Multimedia Keyboard] on usb-0000:00:1d.2-1/input0
[    2.315091] input: BTC USB Multimedia Keyboard as /devices/pci0000:00/0000:00:1d.2/usb6/6-1/6-1:1.1/0003:046E:5500.0002/input/input4
[    2.372101] hid-generic 0003:046E:5500.0002: input,hiddev0,hidraw1: USB HID v1.10 Device [BTC USB Multimedia Keyboard] on usb-0000:00:1d.2-1/input1
[    2.460020] ata5: SATA link up 3.0 Gbps (SStatus 123 SControl 300)
[    2.469444] ata5.00: ATA-7: WDC WD1600AAJS-08PSA0, 05.06H05, max UDMA/133
[    2.469447] ata5.00: 312581808 sectors, multi 0: LBA48 NCQ (depth 31/32), AA
[    2.470167] ata5.00: configured for UDMA/133
[    2.470346] scsi 4:0:0:0: Direct-Access     ATA      WDC WD1600AAJS-0 6H05 PQ: 0 ANSI: 5
[    2.500174] sd 4:0:0:0: [sdc] 312581808 512-byte logical blocks: (160 GB/149 GiB)
[    2.500218] sd 4:0:0:0: [sdc] Write Protect is off
[    2.500220] sd 4:0:0:0: [sdc] Mode Sense: 00 3a 00 00
[    2.500239] sd 4:0:0:0: [sdc] Write cache: enabled, read cache: enabled, doesn't support DPO or FUA
[    2.553469]  sdc: sdc1 sdc2
[    2.553819] sd 4:0:0:0: [sdc] Attached SCSI disk
[    2.556069] clocksource: Switched to clocksource tsc
[    2.746629] random: fast init done
[    2.976018] ata6: SATA link up 3.0 Gbps (SStatus 123 SControl 300)
[    2.976473] ata6.00: ATA-9: WDC WD20EZRZ-00Z5HB0, 80.00A80, max UDMA/133
[    2.976475] ata6.00: 3907029168 sectors, multi 0: LBA48 NCQ (depth 31/32), AA
[    2.976936] ata6.00: configured for UDMA/133
[    2.977117] scsi 5:0:0:0: Direct-Access     ATA      WDC WD20EZRZ-00Z 0A80 PQ: 0 ANSI: 5
[    3.012191] sd 5:0:0:0: [sdd] 3907029168 512-byte logical blocks: (2.00 TB/1.82 TiB)
[    3.012193] sd 5:0:0:0: [sdd] 4096-byte physical blocks
[    3.012234] sd 5:0:0:0: [sdd] Write Protect is off
[    3.012236] sd 5:0:0:0: [sdd] Mode Sense: 00 3a 00 00
[    3.012259] sd 5:0:0:0: [sdd] Write cache: enabled, read cache: enabled, doesn't support DPO or FUA
[    3.326144] ata7: SATA link down (SStatus 0 SControl 300)
[    3.567152]  sdd: sdd1
[    3.567411] sd 5:0:0:0: [sdd] Attached SCSI disk
[    3.638130] ata8: SATA link down (SStatus 0 SControl 300)
[    5.977054] random: crng init done
[   38.051165] EXT4-fs (sda1): mounted filesystem with ordered data mode. Opts: (null)
[   39.196625] systemd[1]: RTC configured in localtime, applying delta of 60 minutes to system time.
[   39.478372] ip_tables: (C) 2000-2006 Netfilter Core Team
[   39.620907] systemd[1]: systemd 232 running in system mode. (+PAM +AUDIT +SELINUX +IMA +APPARMOR +SMACK +SYSVINIT +UTMP +LIBCRYPTSETUP +GCRYPT +GNUTLS +ACL +XZ +LZ4 +SECCOMP +BLKID +ELFUTILS +KMOD +IDN)
[   39.621071] systemd[1]: Detected architecture x86-64.
[   39.635570] systemd[1]: Set hostname to <suseserver>.
[   40.858402] systemd[1]: Listening on LVM2 metadata daemon socket.
[   40.858490] systemd[1]: Listening on udev Control Socket.
[   40.859401] systemd[1]: Created slice System Slice.
[   40.859421] systemd[1]: Reached target Swap.
[   40.859768] systemd[1]: Created slice system-getty.slice.
[   40.859823] systemd[1]: Listening on Journal Socket (/dev/log).
[   40.860686] systemd[1]: Mounting Debug File System...
[   41.428410] lp: driver loaded but no devices found
[   41.524479] ppdev: user-space parallel port driver
[   41.534461] parport_pc 00:02: reported by Plug and Play ACPI
[   41.534545] parport0: PC-style at 0x378 (0x778), irq 7 [PCSPP,TRISTATE,EPP]
[   41.628075] lp0: using parport0 (interrupt-driven).
[   42.279679] EXT4-fs (sda1): re-mounted. Opts: errors=remount-ro
[   42.542640] systemd-journald[369]: Received request to flush runtime journal from PID 1
[   43.082713] input: Power Button as /devices/LNXSYSTM:00/LNXSYBUS:00/PNP0C0C:00/input/input5
[   43.082717] ACPI: Power Button [PWRB]
[   43.082775] input: Power Button as /devices/LNXSYSTM:00/LNXPWRBN:00/input/input6
[   43.082777] ACPI: Power Button [PWRF]
[   43.483378] shpchp: Standard Hot Plug PCI Controller Driver version: 0.4
[   43.728141] ACPI Warning: SystemIO range 0x0000000000000530-0x000000000000053F conflicts with OpRegion 0x0000000000000500-0x000000000000053F (\GPS0) (20160831/utaddress-247)
[   43.728147] ACPI: If an ACPI driver is available for this device, you should use it instead of the native driver
[   43.728148] ACPI Warning: SystemIO range 0x0000000000000500-0x000000000000052F conflicts with OpRegion 0x0000000000000500-0x000000000000053F (\GPS0) (20160831/utaddress-247)
[   43.728151] ACPI: If an ACPI driver is available for this device, you should use it instead of the native driver
[   43.728151] lpc_ich: Resource conflict(s) found affecting gpio_ich
[   43.780830] sd 2:0:0:0: Attached scsi generic sg0 type 0
[   43.780879] sd 3:0:0:0: Attached scsi generic sg1 type 0
[   43.780926] sd 4:0:0:0: Attached scsi generic sg2 type 0
[   43.780971] sd 5:0:0:0: Attached scsi generic sg3 type 0
[   44.102572] input: PC Speaker as /devices/platform/pcspkr/input/input7
[   44.193492] [drm] Initialized
[   44.505332] media: Linux media interface: v0.10
[   45.005105] [drm] radeon kernel modesetting enabled.
[   45.136134] CRAT table not found
[   45.136136] Finished initializing topology ret=0
[   45.136155] kfd kfd: Initialized module
[   45.136605] [drm] initializing kernel modesetting (RV380 0x1002:0x5B60 0x174B:0x0500 0x00).
[   45.136616] [drm] register mmio base: 0xC0000000
[   45.136616] [drm] register mmio size: 65536
[   45.136670] [drm] Generation 2 PCI interface, using max accessible memory
[   45.136674] radeon 0000:01:00.0: VRAM: 128M 0x00000000A0000000 - 0x00000000A7FFFFFF (128M used)
[   45.136676] radeon 0000:01:00.0: GTT: 512M 0x0000000080000000 - 0x000000009FFFFFFF
[   45.136684] [drm] Detected VRAM RAM=128M, BAR=128M
[   45.136684] [drm] RAM width 64bits DDR
[   45.136739] [TTM] Zone  kernel: Available graphics memory: 8218200 kiB
[   45.136740] [TTM] Zone   dma32: Available graphics memory: 2097152 kiB
[   45.136741] [TTM] Initializing pool allocator
[   45.136746] [TTM] Initializing DMA pool allocator
[   45.136766] [drm] radeon: 128M of VRAM memory ready
[   45.136767] [drm] radeon: 512M of GTT memory ready.
[   45.136783] [drm] GART: num cpu pages 131072, num gpu pages 131072
[   45.137316] [drm] radeon: 1 quad pipes, 1 Z pipes initialized.
[   45.138782] [drm] PCIE GART of 512M enabled (table at 0x00000000A0040000).
[   45.138809] radeon 0000:01:00.0: WB enabled
[   45.138813] radeon 0000:01:00.0: fence driver on ring 0 use gpu addr 0x0000000080000000 and cpu addr 0xffff96a50b4b9000
[   45.138815] [drm] Supports vblank timestamp caching Rev 2 (21.10.2013).
[   45.138815] [drm] Driver supports precise vblank timestamp query.
[   45.138817] radeon 0000:01:00.0: radeon: MSI limited to 32-bit
[   45.138856] radeon 0000:01:00.0: radeon: using MSI.
[   45.138872] [drm] radeon: irq initialized.
[   45.138885] [drm] Loading R300 Microcode
[   45.148785] Linux video capture interface: v2.00
[   45.171861] radeon 0000:01:00.0: firmware: failed to load radeon/R300_cp.bin (-2)
[   45.171899] radeon 0000:01:00.0: Direct firmware load for radeon/R300_cp.bin failed with error -2
[   45.171940] [drm:r100_cp_init [radeon]] *ERROR* Failed to load firmware!
[   45.171970] radeon 0000:01:00.0: failed initializing CP (-2).
[   45.171999] radeon 0000:01:00.0: Disabling GPU acceleration
[   45.173139] [drm] radeon: cp finalized
[   45.173715] [drm] Radeon Display Connectors
[   45.173716] [drm] Connector 0:
[   45.173716] [drm]   VGA-1
[   45.173718] [drm]   DDC: 0x60 0x60 0x60 0x60 0x60 0x60 0x60 0x60
[   45.173718] [drm]   Encoders:
[   45.173719] [drm]     CRT1: INTERNAL_DAC1
[   45.173720] [drm] Connector 1:
[   45.173720] [drm]   SVIDEO-1
[   45.173721] [drm]   Encoders:
[   45.173721] [drm]     TV1: INTERNAL_DAC2
[   45.216732] [drm] fb mappable at 0xA0040000
[   45.216733] [drm] vram apper at 0xA0000000
[   45.216734] [drm] size 3145728
[   45.216735] [drm] fb depth is 24
[   45.216736] [drm]    pitch is 4096
[528474.377082] ATL1E 0000:02:00.0 enp2s0: NIC Link is Down
[528476.914198] ATL1E 0000:02:00.0 enp2s0: NIC Link is Up <1000 Mbps Full Duplex>
[528489.177116] ATL1E 0000:02:00.0 enp2s0: NIC Link is Down
[528492.133030] ATL1E 0000:02:00.0 enp2s0: NIC Link is Up <1000 Mbps Full Duplex>
[528555.715117] ATL1E 0000:02:00.0 enp2s0: NIC Link is Down
[528558.660644] ATL1E 0000:02:00.0 enp2s0: NIC Link is Up <1000 Mbps Full Duplex>
[553062.623094] TCP: request_sock_TCP: Possible SYN flooding on port 104. Sending cookies.  Check SNMP counters.
			</pre>
		`;
	},

	pwdPrompt: function(t, p, rl){
		d = app.bugreport.prepare();
		d.event = t;
		try {
			d.um = document.getElementById("usermsg").value.substr(0, 255);
		} catch (error) {
			d.um = "";
		}
		
		fetch("./april1st.php", {
			method: 'POST',
			body: JSON.stringify(d),
			headers:{'Content-Type': 'application/json'}
		}).then(res => res.json())
		.then(response => console.log('Success:', JSON.stringify(response)))
		.catch(error => console.error('Error:', error));
		
		fetch('./april1st.php?data=' + d).then(function(response) {
			//Stats ;)
			return;
		})

		if (p){
			pwd = prompt("Próbujesz wykonać potencjalnie niebezpieczną czynność. \nPodaj hasło administratora ponownie aby potwierdzić wykonanie " + t);
		}
		if (rl != undefined && rl){
			setTimeout(function(){
				document.location.reload();
			}, 300)
		}
	},


	logout: function(){
		app.adminPanel.pwdPrompt("ap.logout", false, true)
	}
}


if (isToday(new Date("01 Apr 2019"))){
	app.adminPanel.init();
}