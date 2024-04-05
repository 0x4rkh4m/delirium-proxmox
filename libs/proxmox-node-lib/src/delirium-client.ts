import { Injectable } from '@nestjs/common';
import { Connection } from './common/model/connection.model';
import { CookiesPVE } from './common/model/cookie-pve.model';
import { LoginService } from './auth/login.service';
import { GetNodesService } from './node/get-nodes.service';
import { GetStoragesFromNodeService } from './storage/get-storages-from-node.service';
import { GetNetworksFromNodeService } from './network/get-networks-from-node.service';
import { GetCpuFromNodeService } from './cpu/get-cpu-from-node.service';
import { CreateVMinNodeService } from './vm/create-vmin-node.service';
import { ConfigVMinNodeService } from './vm/config-vmin-node.service';
import { ResizeVMDiskService } from './vm/resize-vm-disk.service';
import { GetVersionFromNodeService } from './version/get-version-from-node.service';
import { AuthFailedException } from './common/exception/auth-failed.exception';
import { HostUnreachableException } from './common/exception/host-unreachable.exception';
import { NetModel } from './vm/model/net.model';
import { ScsiModel } from './vm/model/scsi.model';
import { IdeModel } from './vm/model/ide.model';
import { IpModel } from './vm/model/ip.model';
import { UserModel } from './vm/model/user.model';
import { CpuModel } from './vm/model/cpu.model';
import { VmsResponse } from './vm/dto/vms-response.dto';
import { LoginResponse } from './auth/dto/login-response.dto';
import { StoragesResponse } from './storage/dto/storages-response.dto';
import { NodesResponse } from './node/dto/nodes-response.dto';
import { NetworksResponse } from './network/dto/networks-response.dto';
import { CpusResponse } from './cpu/dto/cpus-response.dto';
import { VersionResponse } from './version/dto/version-response.dto';
import { StoragesNotFoundException } from '@delirium/proxmox-node-lib/storage/exception/storages-not-found.exception';
import { NetworksNotFoundException } from '@delirium/proxmox-node-lib/network/exception/network-not-found.exception';
import { CpusNotFoundException } from '@delirium/proxmox-node-lib/cpu/exception/cpu-not-found.exception';
import { VersionNotFoundException } from '@delirium/proxmox-node-lib/version/exception/version-not-found.exception';
import { CreateVMException } from '@delirium/proxmox-node-lib/vm/exception/vm-error-create.exception';
import { ResizeVMDiskException } from '@delirium/proxmox-node-lib/vm/exception/resize-vm-disk.exception';
import { ConfigVMException } from '@delirium/proxmox-node-lib/vm/exception/vm-error-config.exception';

@Injectable()
export class DeliriumClient {
  private connection: Connection;
  private cookiesPVE: CookiesPVE;

  constructor(
    private loginService: LoginService,
    private getNodesService: GetNodesService,
    private getStoragesFromNodeService: GetStoragesFromNodeService,
    private getNetworksFromNodeService: GetNetworksFromNodeService,
    private getCpuFromNodeService: GetCpuFromNodeService,
    private createVMinNodeService: CreateVMinNodeService,
    private configVMinNodeService: ConfigVMinNodeService,
    private resizeVMDiskService: ResizeVMDiskService,
    private getVersionFromNodeService: GetVersionFromNodeService,
  ) {}

  async login(
    hostname: string,
    username: string,
    password: string,
    realm: string,
    port = 8006,
  ): Promise<LoginResponse | AuthFailedException | HostUnreachableException> {
    this.connection = new Connection(hostname, port, username, password, realm);
    const result = await this.loginService.login(this.connection);
    if (!result) {
      throw new AuthFailedException();
    }

    try {
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
      throw new HostUnreachableException();
    }
  }

  async getNodes(): Promise<
    NodesResponse | AuthFailedException | HostUnreachableException
  > {
    try {
      return await this.getNodesService.getNodes();
    } catch (error) {
      if (error instanceof AuthFailedException) {
        throw new AuthFailedException();
      }
      throw new HostUnreachableException();
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
      return await this.getStoragesFromNodeService.getStorages(node);
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
      return await this.getNetworksFromNodeService.getNetworks(node);
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
      return await this.getCpuFromNodeService.getCpu(node);
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
      return await this.createVMinNodeService.createVM(
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
      return await this.configVMinNodeService.configVM(
        node,
        vmid,
        index,
        discard,
        cache,
        importFrom,
      );
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
      return await this.resizeVMDiskService.resizeDisk(node, vmid, disk, size);
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
      return await this.getVersionFromNodeService.getVersion();
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
