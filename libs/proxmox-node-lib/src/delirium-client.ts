import { Injectable } from '@nestjs/common';
import { Connection } from '@delirium/proxmox-node-lib/common/model/connection.model';
import { CookiesPVE } from '@delirium/proxmox-node-lib/common/model/cookie-pve.model';
import { HttpService } from '@nestjs/axios';
import { LoginService } from '@delirium/proxmox-node-lib/auth/login.service';
import { GetNodesService } from '@delirium/proxmox-node-lib/node/get-nodes.service';
import { GetStoragesFromNodeService } from '@delirium/proxmox-node-lib/storage/get-storages-from-node.service';
import { GetNetworksFromNodeService } from '@delirium/proxmox-node-lib/network/get-networks-from-node.service';
import { GetCpuFromNodeService } from '@delirium/proxmox-node-lib/cpu/get-cpu-from-node.service';
import { CreateVMinNodeService } from '@delirium/proxmox-node-lib/vm/create-vmin-node.service';
import { ConfigVMinNodeService } from '@delirium/proxmox-node-lib/vm/config-vmin-node.service';
import { ResizeVMDiskService } from '@delirium/proxmox-node-lib/vm/resize-vm-disk.service';
import { GetVersionFromNodeService } from '@delirium/proxmox-node-lib/version/get-version-from-node.service';
import { LoginResponse } from '@delirium/proxmox-node-lib/auth/dto/login-response.dto';
import { AuthFailedException } from '@delirium/proxmox-node-lib/common/exception/auth-failed.exception';
import { HostUnreachableException } from '@delirium/proxmox-node-lib/common/exception/host-unreachable.exception';
import { NodesResponse } from '@delirium/proxmox-node-lib/node/dto/nodes-response.dto';
import { StoragesResponse } from '@delirium/proxmox-node-lib/storage/dto/storages-response.dto';
import { StoragesNotFoundException } from '@delirium/proxmox-node-lib/storage/exception/storages-not-found.exception';
import { NetworksResponse } from '@delirium/proxmox-node-lib/network/dto/networks-response.dto';
import { NetworksNotFoundException } from '@delirium/proxmox-node-lib/network/exception/network-not-found.exception';
import { CpusResponse } from '@delirium/proxmox-node-lib/cpu/dto/cpus-response.dto';
import { CpusNotFoundException } from '@delirium/proxmox-node-lib/cpu/exception/cpu-not-found.exception';
import { NetModel } from '@delirium/proxmox-node-lib/vm/model/net.model';
import { ScsiModel } from '@delirium/proxmox-node-lib/vm/model/scsi.model';
import { IdeModel } from '@delirium/proxmox-node-lib/vm/model/ide.model';
import { IpModel } from '@delirium/proxmox-node-lib/vm/model/ip.model';
import { UserModel } from '@delirium/proxmox-node-lib/vm/model/user.model';
import { CpuModel } from '@delirium/proxmox-node-lib/vm/model/cpu.model';
import { VmsResponse } from '@delirium/proxmox-node-lib/vm/dto/vms-response.dto';
import { CreateVMException } from '@delirium/proxmox-node-lib/vm/exception/vm-error-create.exception';
import { ConfigVMException } from '@delirium/proxmox-node-lib/vm/exception/vm-error-config.exception';
import { ResizeVMDiskException } from '@delirium/proxmox-node-lib/vm/exception/resize-vm-disk.exception';
import { VersionResponse } from '@delirium/proxmox-node-lib/version/dto/version-response.dto';
import { VersionNotFoundException } from '@delirium/proxmox-node-lib/version/exception/version-not-found.exception';

@Injectable()
export class DeliriumClient {
  private connection: Connection;
  private cookiesPVE: CookiesPVE;
  private httpService: HttpService;
  private loginService: LoginService;
  private getNodesService: GetNodesService;
  private getStoragesFromNodeService: GetStoragesFromNodeService;
  private getNetworksFromNodeService: GetNetworksFromNodeService;
  private getCpuFromNodeService: GetCpuFromNodeService;
  private createVMinNodeService: CreateVMinNodeService;
  private configVMinNodeService: ConfigVMinNodeService;
  private resizeVMDiskService: ResizeVMDiskService;
  private getVersionFromNodeService: GetVersionFromNodeService;

  constructor(
    hostname: string,
    username: string,
    password: string,
    realm: string,
    port = 8006,
  ) {
    this.connection = new Connection(hostname, port, username, password, realm);
    this.httpService = new HttpService();
    this.loginService = new LoginService(this.httpService);
    this.getNodesService = new GetNodesService(
      this.httpService,
      this.connection,
      this.cookiesPVE,
    );
    this.getStoragesFromNodeService = new GetStoragesFromNodeService(
      this.httpService,
      this.connection,
      this.cookiesPVE,
    );
    this.getNetworksFromNodeService = new GetNetworksFromNodeService(
      this.httpService,
      this.connection,
      this.cookiesPVE,
    );
    this.getCpuFromNodeService = new GetCpuFromNodeService(
      this.httpService,
      this.connection,
      this.cookiesPVE,
    );
    this.createVMinNodeService = new CreateVMinNodeService(
      this.httpService,
      this.connection,
      this.cookiesPVE,
    );
    this.configVMinNodeService = new ConfigVMinNodeService(
      this.httpService,
      this.connection,
      this.cookiesPVE,
    );
    this.resizeVMDiskService = new ResizeVMDiskService(
      this.httpService,
      this.connection,
      this.cookiesPVE,
    );
    this.getVersionFromNodeService = new GetVersionFromNodeService(
      this.httpService,
      this.connection,
      this.cookiesPVE,
    );
  }

  async login(): Promise<
    LoginResponse | AuthFailedException | HostUnreachableException
  > {
    try {
      const result = await this.loginService.login(this.connection);
      if (!result) {
        throw new AuthFailedException();
      }
      this.cookiesPVE = new CookiesPVE(
        result.getCSRFPreventionToken(),
        result.getCookies(),
        result.getTicket(),
      );
      return result;
    } catch (error) {
      if (error instanceof AuthFailedException) {
        throw new AuthFailedException();
      }
      if (error instanceof HostUnreachableException) {
        throw new HostUnreachableException();
      }
    }
  }

  async getNodes(): Promise<
    NodesResponse | AuthFailedException | HostUnreachableException
  > {
    try {
      const result = await this.getNodesService.getNodes();
      if (!result) {
        throw new AuthFailedException();
      }
      return result;
    } catch (error) {
      if (error instanceof AuthFailedException) {
        throw new AuthFailedException();
      }
      if (error instanceof HostUnreachableException) {
        throw new HostUnreachableException();
      }
    }
  }

  async getStoragesFromNode(
    node: string,
  ): Promise<
    | StoragesResponse
    | AuthFailedException
    | HostUnreachableException
    | StoragesNotFoundException
  > {
    try {
      const result = await this.getStoragesFromNodeService.getStorages(node);
      if (!result) {
        throw new AuthFailedException();
      }
      return result;
    } catch (error) {
      if (error instanceof AuthFailedException) {
        throw new AuthFailedException();
      }
      if (error instanceof HostUnreachableException) {
        throw new HostUnreachableException();
      }
      throw new StoragesNotFoundException();
    }
  }

  async getNetworksFromNode(
    node: string,
  ): Promise<
    | NetworksResponse
    | AuthFailedException
    | HostUnreachableException
    | NetworksNotFoundException
  > {
    try {
      const result = await this.getNetworksFromNodeService.getNetworks(node);
      if (!result) {
        throw new AuthFailedException();
      }
      return result;
    } catch (error) {
      if (error instanceof AuthFailedException) {
        throw new AuthFailedException();
      }
      if (error instanceof HostUnreachableException) {
        throw new HostUnreachableException();
      }
      throw new NetworksNotFoundException();
    }
  }

  async getCpuFromNode(
    node: string,
  ): Promise<
    | CpusResponse
    | AuthFailedException
    | HostUnreachableException
    | CpusNotFoundException
  > {
    try {
      const result = await this.getCpuFromNodeService.getCpu(node);
      if (!result) {
        throw new AuthFailedException();
      }
      return result;
    } catch (error) {
      if (error instanceof AuthFailedException) {
        throw new AuthFailedException();
      }
      if (error instanceof HostUnreachableException) {
        throw new HostUnreachableException();
      }
      throw new CpusNotFoundException();
    }
  }

  async createVM(
    node: string,
    vmid: number,
    cores?: number,
    name?: string,
    net?: NetModel,
    onBoot?: boolean,
    scsihw?: string,
    scsi?: ScsiModel,
    tags?: string,
    ide?: IdeModel,
    boot?: string,
    bootDisk?: string,
    agent?: string,
    ip?: IpModel,
    user?: UserModel,
    cpu?: CpuModel,
  ): Promise<
    | VmsResponse
    | AuthFailedException
    | HostUnreachableException
    | CreateVMException
  > {
    try {
      const result = await this.createVMinNodeService.createVM(
        node,
        vmid,
        cores,
        name,
        net,
        onBoot,
        scsihw,
        scsi,
        tags,
        ide,
        boot,
        bootDisk,
        agent,
        ip,
        user,
        cpu,
      );
      if (!result) {
        throw new AuthFailedException();
      }
      return result;
    } catch (error) {
      if (error instanceof AuthFailedException) {
        throw new AuthFailedException();
      }
      if (error instanceof HostUnreachableException) {
        throw new HostUnreachableException();
      }
      throw new CreateVMException();
    }
  }

  async configVM(
    node: string,
    vmid: number,
    index?: number,
    discard?: string,
    cache?: string,
    importFrom?: string,
  ): Promise<
    string | AuthFailedException | HostUnreachableException | ConfigVMException
  > {
    try {
      const result = await this.configVMinNodeService.configVM(
        node,
        vmid,
        index,
        discard,
        cache,
        importFrom,
      );
      if (!result) {
        throw new AuthFailedException();
      }
      return result;
    } catch (error) {
      if (error instanceof AuthFailedException) {
        throw new AuthFailedException();
      }
      if (error instanceof HostUnreachableException) {
        throw new HostUnreachableException();
      }
      throw new ConfigVMException();
    }
  }

  async resizeDisk(
    node: string,
    vmid: number,
    disk?: string,
    size?: string,
  ): Promise<
    | string
    | AuthFailedException
    | HostUnreachableException
    | ResizeVMDiskException
  > {
    try {
      const result = await this.resizeVMDiskService.resizeDisk(
        node,
        vmid,
        disk,
        size,
      );
      if (!result) {
        throw new AuthFailedException();
      }
      return result;
    } catch (error) {
      if (error instanceof AuthFailedException) {
        throw new AuthFailedException();
      }
      if (error instanceof HostUnreachableException) {
        throw new HostUnreachableException();
      }
      throw new ResizeVMDiskException();
    }
  }

  async getVersion(): Promise<
    | VersionResponse
    | AuthFailedException
    | HostUnreachableException
    | VersionNotFoundException
  > {
    try {
      const result = await this.getVersionFromNodeService.getVersion();
      if (!result) {
        throw new AuthFailedException();
      }
      return result;
    } catch (error) {
      if (error instanceof AuthFailedException) {
        throw new AuthFailedException();
      }
      if (error instanceof HostUnreachableException) {
        throw new HostUnreachableException();
      }
      throw new VersionNotFoundException();
    }
  }
}
