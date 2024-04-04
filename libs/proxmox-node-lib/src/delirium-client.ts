import { HttpService } from '@nestjs/axios';
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
import { AuthFailedException, HostUnreachableException } from './exceptions';

@Injectable()
export class ProxmoxService {
  private connection: Connection;
  private cookiesPVE: CookiesPVE;

  constructor(
    private httpService: HttpService,
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
  ): Promise<void> {
    this.connection = new Connection(hostname, port, username, password, realm);
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
  }

  async getNodes(): Promise<any> {
    try {
      return this.getNodesService.getNodes(this.connection, this.cookiesPVE);
    } catch (error) {
      if (error.response.status === 401) {
        throw new AuthFailedException();
      }
      if (error.response.status === 0) {
        throw new HostUnreachableException();
      }
    }
  }

  async getStoragesFromNode(node: string): Promise<any> {
    try {
      return this.getStoragesFromNodeService.getStoragesFromNode(
        node,
        this.connection,
        this.cookiesPVE,
      );
    } catch (error) {
      if (error.response.status === 401) {
        throw new AuthFailedException();
      }
      if (error.response.status === 0) {
        throw new HostUnreachableException();
      }
    }
  }

  async getNetworksFromNode(node: string): Promise<any> {
    try {
      return this.getNetworksFromNodeService.getNetworksFromNode(
        node,
        this.connection,
        this.cookiesPVE,
      );
    } catch (error) {
      if (error.response.status === 401) {
        throw new AuthFailedException();
      }
      if (error.response.status === 0) {
        throw new HostUnreachableException();
      }
    }
  }

  async getCpusFromNode(node: string): Promise<any> {
    try {
      return this.getCpuFromNodeService.getCpusFromNode(
        node,
        this.connection,
        this.cookiesPVE,
      );
    } catch (error) {
      if (error.response.status === 401) {
        throw new AuthFailedException();
      }
      if (error.response.status === 0) {
        throw new HostUnreachableException();
      }
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
    userModel?: UserModel,
    cpuModel?: CpuModel,
  ): Promise<VmsResponse | null> {
    try {
      return this.createVMinNodeService.createVM(
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
        userModel,
        cpuModel,
        this.connection,
        this.cookiesPVE,
      );
    } catch (error) {
      if (error.response.status === 401) {
        throw new AuthFailedException();
      }
      if (error.response.status === 0) {
        throw new HostUnreachableException();
      }
    }
  }

  async configVM(
    node: string,
    vmid: number,
    index?: number,
    discard?: string,
    cache?: string,
    importFrom?: string,
  ): Promise<string | null> {
    try {
      return this.configVMinNodeService.configVM(
        node,
        vmid,
        index,
        discard,
        cache,
        importFrom,
        this.connection,
        this.cookiesPVE,
      );
    } catch (error) {
      if (error.response.status === 401) {
        throw new AuthFailedException();
      }
      if (error.response.status === 0) {
        throw new HostUnreachableException();
      }
    }
  }

  async resizeVMDisk(
    node: string,
    vmid: number,
    disk?: string,
    size?: string,
  ): Promise<string | null> {
    try {
      return this.resizeVMDiskService.resizeVMDisk(
        node,
        vmid,
        disk,
        size,
        this.connection,
        this.cookiesPVE,
      );
    } catch (error) {
      if (error.response.status === 401) {
        throw new AuthFailedException();
      }
      if (error.response.status === 0) {
        throw new HostUnreachableException();
      }
    }
  }

  async getVersion(): Promise<any> {
    try {
      return this.getVersionFromNodeService.getVersion(
        this.connection,
        this.cookiesPVE,
      );
    } catch (error) {
      if (error.response.status === 401) {
        throw new AuthFailedException();
      }
      if (error.response.status === 0) {
        throw new HostUnreachableException();
      }
    }
  }
}
