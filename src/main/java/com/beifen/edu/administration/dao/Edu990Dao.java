package com.beifen.edu.administration.dao;

import java.util.List;

import com.sun.istack.internal.Nullable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.beifen.edu.administration.domian.Edu990;

public interface Edu990Dao extends JpaRepository<Edu990, Long>,JpaSpecificationExecutor<Edu990> {

	//查询用户是否存在
	@Query(value = "select * from edu990 b where b.yhm=?1", nativeQuery = true)
	public Edu990 checkIsHaveUser(String userName);
	
	//查询密码是否正确
	@Query(value = "select b.mm from edu990 b where b.yhm=?1", nativeQuery = true)
	public String checkPwd(String userName);
	
	//根据用户名查询用户信息
	@Query(value = "select * from edu990 b where b.yhm=?1", nativeQuery = true)
	public Edu990 getUserInfo(String userName);
	
	// 修改已选快捷方式
	@Transactional
	@Modifying
	@Query(value = "UPDATE edu990 SET yxkjfs =?2 WHERE BF990_ID =?1", nativeQuery = true)
	public void newShortcut(String userId, String newShortcut);

	
	//检查有没有系统用户
	@Query(value = "select * from edu990 b where b.js=?1", nativeQuery = true)
	public Edu990 checkHaveSysUser(String sysUse);
	
	//删除角色
	@Transactional
	@Modifying
	@Query(value = "delete from edu990 where Bf990_ID =?1", nativeQuery = true)
	public void removeUser(String bf990_ID);

	
	//删除角色时查看角色当前是否有人使用
	@Query(value = "select * from edu990 b where b.js=?1", nativeQuery = true)
	public List<Edu990> useThisRoleEdu990s(String js);

	//根据用户id查询用户信息
	@Query(value = "select b.* from edu990 b where b.BF990_ID=?1", nativeQuery = true)
	@Nullable
	public Edu990 queryUserById(String userId);

	//查询申请人信息
	@Query(value = "select d.* from edu600 e, edu990 d where e.proposer_key = d.BF990_ID",nativeQuery = true)
	@Nullable
	List<Edu990> selectProposer();

	//查询除系统用户以外的用户
	@Query(value = "select e.* from Edu990 e where e.yhm != 'admin'",nativeQuery = true)
	List<Edu990> findUserWithoutSys();

	//分页查询用户
	@Query(value = "SELECT * FROM (SELECT t.*,ROWNUM r FROM EDU990 t WHERE ROWNUM <= ?1*?2) WHERE r > (?1-1)*?2",nativeQuery = true)
	List<Edu990> findAllInPage(Integer pageNum, Integer pageSize);
}
